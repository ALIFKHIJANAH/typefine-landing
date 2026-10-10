import { MotionConfig } from 'motion/react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { AppStrip } from './components/AppStrip'
import { HowItWorks } from './components/HowItWorks'
import { Modes } from './components/Modes'
import { Privacy } from './components/Privacy'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { DemoVideoProvider } from './components/DemoVideo'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <DemoVideoProvider>
        <div id="top" className="overflow-x-clip">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main">
            <Hero />
            <AppStrip />
            <HowItWorks />
            <Modes />
            <Privacy />
            <Faq />
            <FinalCta />
          </main>
          <Footer />
        </div>
      </DemoVideoProvider>
    </MotionConfig>
  )
}
