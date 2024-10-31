// src/components/upload/ConfirmationView.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'

interface ConfirmationViewProps {
  imageUrl: string
  imageId: string
  onReset: () => void
  onConfirm: () => void
}

export default function ConfirmationView({
  imageUrl,
  imageId,
  onReset,
  onConfirm
}: ConfirmationViewProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId,
          imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      // Redirecionar para o Stripe
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
      console.error('Erro no pagamento:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* ... resto do código permanece igual ... */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* ... Preview da Imagem permanece igual ... */}

        <div className="space-y-6">
          {/* ... Detalhes permanecem iguais ... */}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Valor:</span>
              <span className="text-2xl font-bold">R$ 29,90</span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`
                w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 
                rounded-full flex items-center justify-center mb-3 
                transition-colors disabled:bg-blue-300
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processando...
                </>
              ) : (
                <>
                  Continuar para Pagamento
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={onReset}
              disabled={isProcessing}
              className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:text-gray-400"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Escolher outra foto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}