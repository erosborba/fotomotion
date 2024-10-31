// src/components/upload/ImageUpload.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUploadStart: () => void
  onUploadComplete: (imageUrl: string, imageId: string) => void
  onError: (error: string) => void
}

export default function ImageUpload({
  onUploadStart,
  onUploadComplete,
  onError
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    
    // Validações
    if (!file.type.startsWith('image/')) {
      onError('Por favor, envie apenas imagens.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('A imagem deve ter menos que 5MB.')
      return
    }

    // Preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Upload
    try {
      setIsUploading(true)
      onUploadStart()
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      onUploadComplete(data.imageUrl, data.imageId)
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erro ao fazer upload. Tente novamente.')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }, [onUploadComplete, onError, onUploadStart])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    disabled: isUploading
  })

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'cursor-not-allowed opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
            <p className="text-gray-600">Fazendo upload...</p>
          </div>
        ) : preview ? (
          <div className="relative">
            <div className="relative h-64 w-full">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setPreview(null)
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-base text-gray-600">
                {isDragActive
                  ? 'Solte a imagem aqui...'
                  : 'Arraste uma imagem ou clique para selecionar'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                JPG ou PNG até 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Instruções adicionais */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Recomendações:</p>
        <ul className="mt-2 space-y-1">
          <li>• Use fotos com rostos bem visíveis</li>
          <li>• Evite imagens muito escuras ou desfocadas</li>
          <li>• Prefira fotos com boa iluminação</li>
        </ul>
      </div>
    </div>
  )
}