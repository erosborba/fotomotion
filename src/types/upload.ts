// src/types/upload.ts
export interface UploadResponse {
    success: boolean
    imageUrl: string
    imageId: string
  }
  
  export interface UploadError {
    error: string
  }