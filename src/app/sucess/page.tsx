'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setMessage('Sessão não encontrada')
      return
    }

    console.log('Verificando sessão:', sessionId)

    async function checkPayment() {
      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        const data = await response.json()

        console.log('Resposta da verificação:', data)

        if (response.ok) {
          setStatus('success')
          setMessage('Pagamento confirmado! Seu vídeo está sendo processado.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Erro ao verificar pagamento')
        }
      } catch (error) {
        console.error('Erro na verificação:', error)
        setStatus('error')
        setMessage('Erro ao verificar status do pagamento')
      }
    }

    checkPayment()
  }, [sessionId])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
              <p className="text-gray-600">Verificando pagamento...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                Pagamento Confirmado!
              </h1>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Você receberá um email assim que seu vídeo estiver pronto.
              </p>
              <div className="pt-6">
                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Voltar ao Início
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="w-16 h-16 mx-auto text-red-500">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-800">
                Ops! Algo deu errado
              </h1>
              <p className="text-red-600">{message}</p>
              <div className="pt-6">
                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Tentar Novamente
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense 
      fallback={
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
                <p className="text-gray-600">Carregando...</p>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}