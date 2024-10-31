// src/components/upload/UploadForm.tsx
'use client'

import { useState } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FileError {
  message: string
  type: 'size' | 'format' | 'upload'
}

export default function UploadForm() {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<FileError | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const validateFile = (file: File): FileError | null => {
    if (!file.type.startsWith('image/')) {
      return {
        message: 'Por favor, selecione uma imagem válida (JPG, PNG)',
        type: 'format'
      }
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return {
        message: 'A imagem deve ter menos que 5MB',
        type: 'size'
      }
    }

    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    
    if (selectedFile) {
      const validationError = validateFile(selectedFile)
      
      if (validationError) {
        setError(validationError)
        return
      }

      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !preview) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar imagem')
      }

      // Redirecionar para checkout com ID da imagem
      router.push(`/checkout?imageUrl=${encodeURIComponent(data.imageUrl)}`)
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erro ao processar imagem',
        type: 'upload'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div 
          className={`
            border-2 border-dashed rounded-lg p-6 text-center
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${preview ? 'border-green-300 bg-green-50' : ''}
          `}
        >
          {!preview ? (
            <label className="cursor-pointer block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Clique para selecionar ou arraste sua foto
              </p>
            </label>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null)
                  setFile(null)
                  setError(null)
                }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={!preview || isLoading}
          className={`
            w-full py-2 px-4 rounded-full text-white transition-colors
            ${preview && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
        </button>
      </form>
    </div>
  )
}