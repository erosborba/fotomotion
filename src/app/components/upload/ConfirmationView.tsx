// src/components/upload/ConfirmationView.tsx
'use client'

import Image from 'next/image'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

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
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
        <h2 className="text-xl font-semibold">Upload realizado com sucesso!</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Preview da Imagem */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        {/* Detalhes e Ações */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Detalhes do Pedido</h3>
            <div className="space-y-2 text-gray-600">
              <p>• 1 foto para animação</p>
              <p>• Processamento em até 24h</p>
              <p>• Download em alta qualidade</p>
              <p>• Formato MP4</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Valor:</span>
              <span className="text-2xl font-bold">R$ 29,90</span>
            </div>

            <button
              onClick={onConfirm}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-full flex items-center justify-center mb-3 transition-colors"
            >
              Continuar para Pagamento
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>

            <button
              onClick={onReset}
              className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800"
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