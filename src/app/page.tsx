// src/app/page.tsx
'use client'

import { useState } from 'react'
import ImageUpload from '@/app/components/upload/ImageUpload'
import ConfirmationView from '@/app/components/upload/ConfirmationView'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<{url: string, id: string} | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUploadComplete = (imageUrl: string) => {
    console.log('Upload completo:', { imageUrl })
    setUploadedImage({ url: imageUrl, id: imageUrl })
    setIsUploading(false)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setError(null)
  }

  const handleConfirm = () => {
    // Aqui vamos adicionar a lógica de redirecionamento para o checkout
    console.log('Prosseguindo para pagamento...')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-800">FotoMotion</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {isUploading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
            <p className="mt-4 text-gray-600">Fazendo upload da sua imagem...</p>
          </div>
        ) : uploadedImage ? (
          <ConfirmationView
            imageUrl={uploadedImage.url}
            imageId={uploadedImage.id}
            onReset={handleReset}
            onConfirm={handleConfirm}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-8">
              Transforme suas fotos em vídeos
            </h2>
            <ImageUpload 
              onUploadStart={() => setIsUploading(true)}
              onUploadComplete={handleUploadComplete}
              onError={(err) => {
                setError(err)
                setIsUploading(false)
              }}
            />
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}