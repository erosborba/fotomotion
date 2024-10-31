import { NextResponse } from 'next/server'
import stripe from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID é obrigatório' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      success: true,
      status: session.payment_status
    })
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar pagamento' },
      { status: 500 }
    )
  }
}