import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { EASE } from '../lib/motion'
import { Brand, DownloadButton } from './ui'

export const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Modes', href: '#modes' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  // Collapsing the menu cancels the browser's smooth scroll, so jump only after it has closed.
  const pendingHref = useRef(null)

  const goTo = (event, href) => {
    event.preventDefault()
    pendingHref.current = href
    history.pushState(null, '', href)
    setOpen(false)
  }

  const scrollToPending = () => {
    const target = pendingHref.current && document.querySelector(pendingHref.current)
    pendingHref.current = null
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled || open ? 'border-line bg-white/85 backdrop-blur-md' : 'border-transparent bg-white'
      }`}
    >
      <nav className="container-page flex items-center justify-between py-4 lg:py-6" aria-label="Main">
        <div className="lg:w-60">
          <Brand />
        </div>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-medium text-muted transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2 lg:w-60">
          <DownloadButton size="sm" label="Download" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex size-[38px] items-center justify-center rounded-full text-ink hover:bg-surface md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence onExitComplete={scrollToPending}>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="container-page overflow-hidden md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="border-t border-line first:border-t-0">
                <a
                  href={link.href}
                  onClick={(event) => goTo(event, link.href)}
                  className="block py-3.5 text-base font-medium text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
