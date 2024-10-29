// src/components/sections/Hero.tsx
'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforme suas fotos antigas<br />em vídeos mágicos
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Use inteligência artificial para dar vida às suas memórias mais especiais
          </p>
          
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full flex items-center mx-auto transition-all duration-300"
          >
            Experimente Agora
            <ArrowRight className={`ml-2 transition-transform duration-300 ${
              isHovered ? 'translate-x-1' : ''
            }`} />
          </button>
          
          <p className="text-gray-500 mt-4">
            Preço especial de lançamento: R$29,90 por foto
          </p>
        </div>
      </div>
    </div>
  )
}