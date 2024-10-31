// src/components/upload/ImageUpload.tsx
'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUploadComplete: (imageUrl: string) => void
}

export default function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    
    if (!file.type.startsWith('image/')) {
      setError('Por favor, envie apenas imagens.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter menos que 5MB.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setError(null)

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao fazer upload')
      }

      const { imageUrl } = await response.json()
      onUploadComplete(imageUrl)
    } catch (err) {
      setError('Erro ao fazer upload. Tente novamente.')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }, [onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  })

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
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
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setPreview(null)
                setError(null)
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
        
        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  )
}