import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE } from '../lib/motion'
import { Eyebrow, Item, Stagger, sectionTitle } from './ui'

// TODO: only the first answer comes from the design; review the rest with the product team.
const FAQS = [
  {
    q: 'What is Typefine, and who is it for?',
    a: 'Typefine is a macOS app that rewrites the text you select, in whatever app you’re using. It’s for anyone who writes in English every day, especially if English isn’t your first language.',
  },
  {
    q: 'Does Typefine read everything I type?',
    a: 'No. Typefine only reads the text you select, and only when you press ⌥E. Nothing runs in the background, and there is no keystroke logging.',
  },
  {
    q: 'Which apps work with Typefine?',
    a: 'Slack, Gmail, Notion, Linear, VS Code, Chrome, Safari and Telegram, plus any other app whose text fields support macOS Accessibility.',
  },
  {
    q: 'How do you keep my API key secure?',
    a: 'Your key is encrypted and stored in the macOS Keychain. Requests go straight from your Mac to your provider, so your key and your text never pass through our servers.',
  },
  {
    q: 'Can I use my own AI provider?',
    a: 'Yes. You connect your own provider with your own API key, and Typefine sends your selection directly to it.',
  },
  {
    q: 'What happens if Typefine can’t replace text?',
    a: 'The result stays in the panel so you can copy it with ⌘C and paste it yourself. Your original text is only changed when you press Enter.',
  },
]

export function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="container-page flex flex-col gap-10 pt-24 lg:flex-row lg:gap-24 lg:pt-[150px]">
      <Stagger className="flex flex-col gap-5 lg:w-[360px] lg:shrink-0">
        <Item>
          <Eyebrow>FAQ</Eyebrow>
        </Item>
        <Item as="h2" className={sectionTitle}>
          Before you install
        </Item>
        <Item as="p" className="text-[17px] leading-[26px] text-muted">
          Short answers about privacy, supported apps and what happens to your text.
        </Item>
      </Stagger>

      <Stagger as="ul" gap={0.06} className="flex-1 border-t border-line">
        {FAQS.map((item, i) => (
          <Item as="li" key={item.q} className="border-b border-line">
            <Question {...item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          </Item>
        ))}
      </Stagger>
    </section>
  )
}

function Question({ q, a, open, onToggle }) {
  const id = useId()

  return (
    <>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="group flex w-full items-center gap-6 py-[26px] text-left"
        >
          <span className="flex-1 text-[17px] font-medium tracking-[-0.3px] text-ink sm:text-[19px]">{q}</span>
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
              open ? 'bg-ink text-white' : 'hairline-strong text-ink group-hover:bg-surface'
            }`}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14" />
              <motion.path
                d="M12 5v14"
                initial={false}
                animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }}
                transition={{ duration: 0.3, ease: EASE }}
              />
            </svg>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-[600px] pb-[26px] text-base leading-[26px] text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
