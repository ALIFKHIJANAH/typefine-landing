import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ShieldCheck } from 'lucide-react'
import { DOWNLOAD_URL, NEWSLETTER_ENDPOINT } from '../config'
import { useOpenDemo } from './DemoVideo'
import { Brand } from './ui'

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Writing modes', href: '#modes' },
      { label: 'Privacy', href: '#privacy' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    heading: 'Get started',
    links: [
      { label: 'Download for macOS', href: DOWNLOAD_URL },
      { label: 'Watch the demo', opensDemo: true },
      { label: 'Connect a provider', href: '#privacy' },
    ],
  },
]

const MESSAGES = {
  done: 'Thanks, you’re on the list.',
  error: 'That didn’t go through. Try again in a minute.',
  closed: 'Sign-ups aren’t open yet. Check back soon.',
}

const footerLink = 'w-fit text-left text-[15px] text-muted transition-colors hover:text-ink'

export function Footer() {
  const openDemo = useOpenDemo()

  return (
    <footer className="container-page flex flex-col gap-14 pt-24 pb-12 lg:gap-[72px] lg:pt-[120px]">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:flex lg:gap-16">
        <div className="col-span-2 flex flex-col gap-4 lg:w-[300px] lg:shrink-0">
          <Brand />
          <p className="text-[15px] leading-[23px] text-muted">A Mac app that fixes your English in any text box.</p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading} className="flex flex-col gap-3.5 lg:w-[180px] lg:shrink-0">
            <h2 className="text-sm font-semibold text-ink">{column.heading}</h2>
            {column.links.map((link) =>
              link.opensDemo ? (
                <button key={link.label} type="button" onClick={openDemo} className={footerLink}>
                  {link.label}
                </button>
              ) : (
                <a key={link.label} href={link.href} className={footerLink}>
                  {link.label}
                </a>
              ),
            )}
          </nav>
        ))}

        <Newsletter />
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">© 2026 Typefine</p>
        <p className="flex items-center gap-2 text-sm text-muted">
          <ShieldCheck className="size-3.5" aria-hidden />
          Private by default · Made for macOS
        </p>
      </div>
    </footer>
  )
}

function Newsletter() {
  const [status, setStatus] = useState('idle')

  async function subscribe(event) {
    event.preventDefault()
    if (!NEWSLETTER_ENDPOINT) {
      setStatus('closed')
      return
    }
    const email = new FormData(event.currentTarget).get('email')
    setStatus('sending')
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error(`Subscribe failed: ${res.status}`)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="col-span-2 flex min-w-0 flex-col gap-3.5 lg:flex-1">
      <h2 id="newsletter-heading" className="text-sm font-semibold text-ink">
        Hear when we ship something new
      </h2>
      <form
        onSubmit={subscribe}
        aria-labelledby="newsletter-heading"
        className="hairline-strong flex h-12 items-center gap-2 rounded-full py-1 pr-1 pl-4 focus-within:outline-accent"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
        />
        <motion.button
          type="submit"
          disabled={status === 'sending'}
          whileTap={{ scale: 0.97 }}
          className="h-10 shrink-0 rounded-full bg-ink px-4 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#1d2129] disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Keep me posted'}
        </motion.button>
      </form>
      <div aria-live="polite" className="min-h-[19px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-[13px] leading-[19px] ${status === 'error' ? 'text-[#b42318]' : 'text-muted'}`}
          >
            {MESSAGES[status] ?? 'Low-volume product updates. Unsubscribe whenever you like.'}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
