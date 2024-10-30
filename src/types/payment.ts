// src/types/payment.ts
export interface Payment {
    id: string
    sessionId: string
    customerId: string
    amount: number
    imageId?: string
    status: 'pending' | 'completed' | 'failed' | 'processing'
    createdAt: Date
    updatedAt: Date
  }
  
  export interface ProcessingJob {
    id: string
    paymentId: string
    imageId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    result?: {
      videoUrl: string
      thumbnailUrl: string
    }
    createdAt: Date
    updatedAt: Date
  }