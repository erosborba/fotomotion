// src/components/upload/UploadForm.tsx
'use client'

import { useState } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'

export default function UploadForm() {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo e tamanho
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem.')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter menos que 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preview) return

    setIsLoading(true)
    try {
      // Aqui vamos adicionar a lógica de upload
      // Por enquanto só simula delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Redirecionar para pagamento
    } catch (error) {
      alert('Erro ao fazer upload. Tente novamente.')
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!preview || isLoading}
          className={`w-full py-2 px-4 rounded-full text-white ${
            preview && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
        </button>
      </form>
    </div>
  )
}