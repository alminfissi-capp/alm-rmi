import { createClient } from "@/lib/supabase/server"

/**
 * Initialize Supabase Storage bucket for RMI documents
 * Creates the bucket if it doesn't exist
 */
export async function initializeStorage() {
  const supabase = await createClient()

  // Check if bucket exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error("Error listing buckets:", listError)
    return { success: false, error: listError }
  }

  const bucketExists = buckets?.some((bucket) => bucket.name === "rmi-documents")

  if (!bucketExists) {
    // Create bucket
    const { error: createError } = await supabase.storage.createBucket("rmi-documents", {
      public: false,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ["application/pdf"],
    })

    if (createError && !createError.message.includes("already exists")) {
      console.error("Error creating bucket:", createError)
      return { success: false, error: createError }
    }

    console.log("✓ Storage bucket 'rmi-documents' created successfully")
  } else {
    console.log("✓ Storage bucket 'rmi-documents' already exists")
  }

  return { success: true }
}

/**
 * Upload a PDF file to Supabase Storage
 */
export async function uploadPDF(
  userId: string,
  fileName: string,
  fileBuffer: Buffer
): Promise<{ success: boolean; filePath?: string; error?: any }> {
  const supabase = await createClient()

  const filePath = `pdfs/${userId}/${fileName}`

  const { data, error } = await supabase.storage
    .from("rmi-documents")
    .upload(filePath, fileBuffer, {
      contentType: "application/pdf",
      upsert: false,
    })

  if (error) {
    console.error("Error uploading PDF:", error)
    return { success: false, error }
  }

  return { success: true, filePath }
}

/**
 * Get a signed URL for downloading a PDF
 */
export async function getPDFDownloadUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from("rmi-documents")
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error("Error creating signed URL:", error)
    return { success: false, error }
  }

  return { success: true, url: data?.signedUrl }
}

/**
 * Delete a PDF file from storage
 */
export async function deletePDF(
  filePath: string
): Promise<{ success: boolean; error?: any }> {
  const supabase = await createClient()

  const { error } = await supabase.storage.from("rmi-documents").remove([filePath])

  if (error) {
    console.error("Error deleting PDF:", error)
    return { success: false, error }
  }

  return { success: true }
}

/**
 * List all PDFs for a user
 */
export async function listUserPDFs(
  userId: string
): Promise<{ success: boolean; files?: any[]; error?: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage.from("rmi-documents").list(`pdfs/${userId}`)

  if (error) {
    console.error("Error listing PDFs:", error)
    return { success: false, error }
  }

  return { success: true, files: data }
}
