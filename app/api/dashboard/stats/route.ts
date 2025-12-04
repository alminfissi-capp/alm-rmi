import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    // Get total rilievi count
    const totalRilievi = await prisma.rilievo.count({
      where: { user_id: user.id },
    })

    // Get rilievi by status
    const rilieviByStatus = await prisma.rilievo.groupBy({
      by: ["status"],
      where: { user_id: user.id },
      _count: {
        status: true,
      },
    })

    const statusCounts = rilieviByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status
      return acc
    }, {} as Record<string, number>)

    // Get rilievi created this month
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const rilieviThisMonth = await prisma.rilievo.count({
      where: {
        user_id: user.id,
        created_at: {
          gte: firstDayOfMonth,
        },
      },
    })

    // Get rilievi created last month
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const rilieviLastMonth = await prisma.rilievo.count({
      where: {
        user_id: user.id,
        created_at: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth,
        },
      },
    })

    // Calculate percentage change
    const monthlyChange = rilieviLastMonth > 0
      ? ((rilieviThisMonth - rilieviLastMonth) / rilieviLastMonth) * 100
      : rilieviThisMonth > 0 ? 100 : 0

    // Get total serramenti count
    const totalSerramenti = await prisma.serramento.count({
      where: {
        rilievo: {
          user_id: user.id,
        },
      },
    })

    // Get recent activity (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5) // Changed to -5 to include current month

    // Generate array of last 6 months
    const last6Months: string[] = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = date.toLocaleDateString("it-IT", {
        month: "short",
        year: "numeric",
      })
      last6Months.push(monthKey)
    }

    // Initialize monthlyData with 0 for all months
    const monthlyData: Record<string, number> = {}
    last6Months.forEach(month => {
      monthlyData[month] = 0
    })

    // Get all rilievi from last 6 months
    const recentRilievi = await prisma.rilievo.findMany({
      where: {
        user_id: user.id,
        created_at: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        created_at: true,
      },
    })

    // Count rilievi per month
    recentRilievi.forEach(rilievo => {
      const month = new Date(rilievo.created_at).toLocaleDateString("it-IT", {
        month: "short",
        year: "numeric",
      })
      if (monthlyData[month] !== undefined) {
        monthlyData[month]++
      }
    })

    return NextResponse.json({
      totalRilievi,
      rilieviThisMonth,
      monthlyChange: Math.round(monthlyChange),
      totalSerramenti,
      statusCounts,
      monthlyData,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Errore nel recupero delle statistiche" },
      { status: 500 }
    )
  }
}
