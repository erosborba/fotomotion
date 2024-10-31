'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, CreditCard, Lock } from 'lucide-react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const imageUrl = searchParams.get('imageUrl')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      })

      const { sessionId, error } = await response.json()

      if (error) throw new Error(error)

      // Redirecionar para o checkout do Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Erro no pagamento:', error)
      // Mostrar erro ao usuário
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-center flex-1">
              Finalizar Pedido
            </h1>
          </div>

          {/* Resumo do Pedido */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Sua Foto</h2>
              {imageUrl && (
                <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Resumo</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>1 Foto</span>
                  <span>R$29,90</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>R$29,90</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Pagamento */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`
              w-full py-4 rounded-full text-white text-lg font-semibold
              flex items-center justify-center space-x-2
              ${isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {isProcessing ? (
              <>Processando...</>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pagar R$29,90</span>
                <Lock className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Informações de Segurança */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p className="flex items-center justify-center">
              <Lock className="w-4 h-4 mr-1" />
              Pagamento 100% seguro
            </p>
            <p className="mt-2">
              Satisfação garantida ou seu dinheiro de volta
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 