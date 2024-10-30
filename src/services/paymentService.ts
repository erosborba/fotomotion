// src/services/paymentService.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class PaymentService {
  static async createPayment({
    sessionId,
    customerId,
    amount,
    imageId,
    userId,
  }: {
    sessionId: string
    customerId: string
    amount: number
    imageId: string
    userId: string
  }) {
    try {
      const payment = await prisma.payment.create({
        data: {
          sessionId,
          customerId,
          amount,
          status: 'PENDING',
          user: {
            connect: { id: userId },
          },
          image: {
            connect: { id: imageId },
          },
        },
        include: {
          image: true,
          user: true,
        },
      })

      return payment
    } catch (error) {
      console.error('Error creating payment:', error)
      throw error
    }
  }

  static async updatePaymentStatus({
    sessionId,
    status,
    errorMessage,
  }: {
    sessionId: string
    status: 'COMPLETED' | 'FAILED' | 'REFUNDED'
    errorMessage?: string
  }) {
    try {
      const payment = await prisma.payment.update({
        where: { sessionId },
        data: {
          status,
          errorMessage,
          updatedAt: new Date(),
        },
        include: {
          image: true,
          user: true,
        },
      })

      // Se o pagamento foi completado, atualizar status da imagem
      if (status === 'COMPLETED' && payment.imageId) {
        await prisma.image.update({
          where: { id: payment.imageId },
          data: { status: 'PROCESSING' },
        })
      }

      return payment
    } catch (error) {
      console.error('Error updating payment:', error)
      throw error
    }
  }

  static async getPaymentBySessionId(sessionId: string) {
    return prisma.payment.findUnique({
      where: { sessionId },
      include: {
        image: true,
        user: true,
      },
    })
  }

  static async getPaymentsByUserId(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: {
        image: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}