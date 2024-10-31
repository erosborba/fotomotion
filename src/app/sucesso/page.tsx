'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import StageTransition from '@/components/ui/StageTransition'

type ProcessingStage = 'verifying' | 'processing' | 'completed' | 'error'

interface ProcessingState {
  stage: ProcessingStage
  title: string
  description: string
  icon: 'loading' | 'success' | 'error' | 'processing'
}

export default function SucessoPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [stage, setStage] = useState<ProcessingStage>('verifying')

  const stages: Record<ProcessingStage, ProcessingState> = {
    verifying: {
      stage: 'verifying',
      title: 'Verificando Pagamento',
      description: 'Aguarde enquanto confirmamos seu pagamento...',
      icon: 'loading'
    },
    processing: {
      stage: 'processing',
      title: 'Processando sua Foto',
      description: 'Nossa IA está trabalhando na sua imagem...',
      icon: 'processing'
    },
    completed: {
      stage: 'completed',
      title: 'Tudo Pronto!',
      description: 'Seu vídeo será enviado para seu email em breve.',
      icon: 'success'
    },
    error: {
      stage: 'error',
      title: 'Ops! Algo deu errado',
      description: 'Por favor, entre em contato com nosso suporte.',
      icon: 'error'
    }
  }

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        if (!response.ok) throw new Error('Falha na verificação')
        
        setStage('processing')
        
        // Iniciar polling do status do processamento
        const checkStatus = async () => {
          const statusResponse = await fetch('/api/check-processing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          })

          if (!statusResponse.ok) throw new Error('Falha ao verificar status')

          const { status } = await statusResponse.json()

          if (status === 'completed') {
            setStage('completed')
            return
          }

          if (status === 'error') {
            throw new Error('Processamento falhou')
          }

          // Continuar polling a cada 3 segundos
          setTimeout(checkStatus, 3000)
        }

        checkStatus()

      } catch (error) {
        console.error('Erro:', error)
        setStage('error')
      }
    }

    if (sessionId) {
      verifyPayment()
    }
  }, [sessionId])

  const currentStage = stages[stage]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <StageTransition
            stage={currentStage.stage}
            title={currentStage.title}
            description={currentStage.description}
            icon={currentStage.icon}
          />

          {stage === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <Link 
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
              >
                Voltar para Home
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 