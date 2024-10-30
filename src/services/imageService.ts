// src/services/imageService.ts
import { prisma } from '@/lib/prisma'

export class ImageService {
  static async createImage({
    originalUrl,
    userId,
  }: {
    originalUrl: string
    userId: string
  }) {
    try {
      return await prisma.image.create({
        data: {
          originalUrl,
          status: 'WAITING_PAYMENT',
          user: {
            connect: { id: userId },
          },
        },
      })
    } catch (error) {
      console.error('Error creating image:', error)
      throw error
    }
  }

  static async updateImageStatus({
    imageId,
    status,
    processedUrl,
  }: {
    imageId: string
    status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
    processedUrl?: string
  }) {
    try {
      return await prisma.image.update({
        where: { id: imageId },
        data: {
          status,
          processedUrl,
          updatedAt: new Date(),
        },
      })
    } catch (error) {
      console.error('Error updating image:', error)
      throw error
    }
  }

  static async getImagesByUserId(userId: string) {
    return prisma.image.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }
}