// src/app/api/webhook/stripe/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { PaymentService } from '@/services/paymentService'
import { ImageService } from '@/services/imageService'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
    const body = await request.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')
  
    let event: Stripe.Event
  
    try {
      if (!sig) throw new Error('No signature')
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Registrar pagamento no banco
        await registerPayment({
          sessionId: session.id,
          customerId: session.customer?.toString() || '',
          amount: session.amount_total || 0,
          imageId: session.metadata?.imageId,
          status: 'completed'
        })

        // Iniciar processamento da imagem
        await startImageProcessing(session.metadata?.imageId)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Registrar falha e notificar cliente
        await registerPayment({
          sessionId: paymentIntent.id,
          customerId: paymentIntent.customer?.toString() || '',
          amount: paymentIntent.amount,
          imageId: paymentIntent.metadata?.imageId,
          status: 'failed'
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Função auxiliar para registrar pagamento
async function registerPayment({
  sessionId,
  customerId,
  amount,
  imageId,
  status
}: {
  sessionId: string
  customerId: string
  amount: number
  imageId?: string
  status: 'completed' | 'failed'
}) {
  // TODO: Implementar registro no banco de dados
  console.log('Registrando pagamento:', {
    sessionId,
    customerId,
    amount,
    imageId,
    status
  })
}

// Função auxiliar para iniciar processamento
async function startImageProcessing(imageId?: string) {
  if (!imageId) return

  try {
    // Iniciar processamento assíncrono
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageId }),
    })

    if (!response.ok) {
      throw new Error('Failed to start processing')
    }

    // TODO: Atualizar status do pedido para 'processing'
    
  } catch (error) {
    console.error('Error starting image processing:', error)
    // TODO: Implementar retry mechanism
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
    try {
      const payment = await PaymentService.updatePaymentStatus({
        sessionId: session.id,
        status: 'COMPLETED',
      })
  
      if (payment?.imageId) {
        await ImageService.updateImageStatus({
          imageId: payment.imageId,
          status: 'PROCESSING',
        })
  
        // Iniciar processamento da imagem
        await startImageProcessing(payment.imageId)
      }
    } catch (error) {
      console.error('Error handling successful payment:', error)
      throw error
    }
  }
  
  async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
    try {
      await PaymentService.updatePaymentStatus({
        sessionId: paymentIntent.id,
        status: 'FAILED',
        errorMessage: paymentIntent.last_payment_error?.message,
      })
    } catch (error) {
      console.error('Error handling failed payment:', error)
      throw error
    }
  }