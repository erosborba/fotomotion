// src/components/sections/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">FotoMotion</h3>
              <p className="text-sm">
                Transformando suas memórias em momentos mágicos através da inteligência artificial.
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-sm">
                <li>Como Funciona</li>
                <li>Preços</li>
                <li>Exemplos</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>Sobre Nós</li>
                <li>Blog</li>
                <li>Contato</li>
                <li>Carreiras</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacidade</li>
                <li>Termos de Uso</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; 2024 FotoMotion. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    )
  }