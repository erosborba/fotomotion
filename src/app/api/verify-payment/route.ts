// src/app/api/verify-payment/route.ts
import { NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID não fornecido' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // Atualizar status da imagem e pagamento no banco
      const imageId = session.metadata?.imageId

      if (imageId) {
        await prisma.image.update({
          where: { id: imageId },
          data: { status: 'PROCESSING' }
        })

        // Criar registro de pagamento
        await prisma.payment.create({
          data: {
            sessionId,
            customerId: session.customer as string,
            amount: session.amount_total || 0,
            status: 'COMPLETED',
            imageId,
            userId: 'temp-user-id', // TODO: Usar ID real do usuário quando tivermos autenticação
          }
        })
      }

      return NextResponse.json({
        success: true,
        status: 'paid',
        message: 'Pagamento confirmado!'
      })
    }

    return NextResponse.json({
      success: false,
      status: session.payment_status,
      error: 'Pagamento não confirmado'
    }, { status: 400 })

  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento' },
      { status: 500 }
    )
  }
}