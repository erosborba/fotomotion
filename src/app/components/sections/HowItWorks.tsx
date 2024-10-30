// src/components/sections/HowItWorks.tsx
import { Upload, Sparkles, Camera } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: "Upload da Foto",
    description: "Envie sua foto antiga em segundos"
  },
  {
    icon: Sparkles,
    title: "IA em Ação",
    description: "Nossa tecnologia processa sua imagem"
  },
  {
    icon: Camera,
    title: "Memória em Movimento",
    description: "Receba seu vídeo animado"
  }
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Como Funciona
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}