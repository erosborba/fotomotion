// src/app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia'
})

export async function POST(request: Request) {
  try {
    const { imageId, imageUrl } = await request.json()

    // Log para debug
    console.log('Criando sessão de checkout:', { imageId, imageUrl })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Animação de Foto',
              description: 'Transforme sua foto em vídeo animado',
              images: [imageUrl],
            },
            unit_amount: 2990, // R$29,90 em centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
      metadata: {
        imageId,
      },
    })

    // Log da URL de sucesso
    console.log('URL de sucesso:', `${process.env.NEXT_PUBLIC_URL}/success`)
    console.log('Session criada:', { 
      id: session.id, 
      url: session.url 
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erro ao criar sessão:', error)
    return NextResponse.json(
      { error: 'Erro ao criar sessão de pagamento' },
      { status: 500 }
    )
  }
}