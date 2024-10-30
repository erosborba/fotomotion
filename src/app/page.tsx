// src/app/page.tsx
import Hero from './components/sections/Hero'
import HowItWorks from './components/sections/HowItWorks'
import Pricing from './components/sections/Pricing'
import CallToAction from './components/sections/CallToAction'
import Footer from './components/sections/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Pricing />
      <CallToAction />
      <Footer />
    </main>
  )
}