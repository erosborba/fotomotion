// src/components/sections/Pricing.tsx
import { Check } from 'lucide-react'

const plans = [
  {
    name: "1 Foto",
    price: "R$29,90",
    features: [
      "Alta qualidade",
      "Entrega em até 24h",
      "Suporte via email",
      "Resultado em MP4"
    ]
  },
  {
    name: "3 Fotos",
    price: "R$79,90",
    popular: true,
    features: [
      "Alta qualidade",
      "Entrega em até 24h",
      "Suporte prioritário",
      "Resultado em MP4",
      "15% de desconto"
    ]
  },
  {
    name: "5 Fotos",
    price: "R$119,90",
    features: [
      "Alta qualidade",
      "Entrega em até 24h",
      "Suporte prioritário",
      "Resultado em MP4",
      "20% de desconto"
    ]
  }
]

export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Escolha seu Plano
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-lg p-8 relative ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                  Mais Popular
                </span>
              )}
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full transition-colors">
                Escolher Plano
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}