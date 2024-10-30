// src/components/sections/CallToAction.tsx
export default function CallToAction() {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para dar vida às suas memórias?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Transforme suas fotos antigas em momentos mágicos hoje mesmo
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-semibold transition-colors">
              Começar Agora
            </button>
          </div>
          <p className="mt-6 text-sm text-blue-100">
            Satisfação garantida ou seu dinheiro de volta
          </p>
        </div>
      </section>
    )
  }