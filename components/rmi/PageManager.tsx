"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { PageName } from "@/lib/types/database.types"

interface PageManagerProps {
  pages: PageName[]
  currentPage: PageName
  onPageChange: (page: PageName) => void
  onPageAdd: () => void
  onPageRemove: (page: PageName) => void
  readOnly?: boolean
}

export function PageManager({
  pages,
  currentPage,
  onPageChange,
  onPageAdd,
  onPageRemove,
  readOnly = false,
}: PageManagerProps) {
  const [pageToDelete, setPageToDelete] = useState<PageName | null>(null)

  const handleDeleteConfirm = () => {
    if (pageToDelete) {
      onPageRemove(pageToDelete)
      setPageToDelete(null)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b bg-background p-2">
        {/* Add Page Button */}
        {!readOnly && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPageAdd}
            className="h-9 border-dashed border-alm-green text-alm-green hover:bg-alm-green/10 hover:text-alm-green"
          >
            <Plus className="h-4 w-4 mr-1" />
            Aggiungi
          </Button>
        )}

        {/* Page Tabs */}
        <Tabs value={currentPage} onValueChange={(value) => onPageChange(value as PageName)}>
          <TabsList className="h-9 bg-muted">
            {pages.map((page) => (
              <div key={page} className="relative group">
                <TabsTrigger
                  value={page}
                  className="page-tab relative pr-8 data-[state=active]:font-semibold hover:bg-alm-blue/10 transition-colors"
                >
                  {page}
                </TabsTrigger>
                {!readOnly && pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPageToDelete(page)
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-opacity flex items-center justify-center z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!pageToDelete} onOpenChange={() => setPageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina {pageToDelete}?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà il serramento <strong>{pageToDelete}</strong> in modo permanente.
              Tutti i dati inseriti per questo serramento verranno persi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
