import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE, useChord } from '../lib/motion'
import { Eyebrow, Item, Key, Stagger, sectionTitle } from './ui'
import { ResultPanel, StreamedText } from './ResultPanel'

const ORIGINAL = 'hey can u check the api thing? its been failing alot since this morning and customers r noticing'

const MODES = [
  {
    name: 'Enhance',
    description: 'Clearer, more natural phrasing',
    result: 'Can you check the API? It’s been failing a lot since this morning, and customers are noticing.',
  },
  {
    name: 'Professional',
    description: 'Polished for work and clients',
    result:
      'Could you take a look at the API? It has been failing repeatedly since this morning, and customers are starting to notice.',
  },
  {
    name: 'Casual',
    description: 'Relaxed and friendly',
    result: 'Hey, could you check the API? It’s been failing a bunch since this morning and customers are noticing.',
  },
  {
    name: 'Grammar',
    description: 'Fix mistakes, keep your words',
    result: 'Hey, can you check the API thing? It’s been failing a lot since this morning, and customers are noticing.',
  },
  {
    name: 'Shorten',
    description: 'Same message, fewer words',
    result: 'Can you check the API? It’s been failing all morning and customers have noticed.',
  },
  {
    name: 'Technical',
    description: 'Precise wording for engineers',
    result:
      'Can you investigate the API? Requests have been failing repeatedly since this morning, and the errors are now customer-facing.',
  },
  {
    name: 'Custom',
    description: 'Write your own instructions',
    result:
      'Hi! Could you look into the API when you get a moment? It’s been failing since this morning and customers are starting to notice.',
  },
]

export function Modes() {
  const [active, setActive] = useState(1)
  const [switches, setSwitches] = useState(0)
  const [alt, e] = useChord(switches)
  const mode = MODES[active]
  const label = mode.label ?? mode.name

  const choose = (index) => {
    if (index === active) return
    setActive(index)
    setSwitches((n) => n + 1)
  }

  return (
    <section id="modes" className="container-page flex flex-col gap-12 pt-24 lg:flex-row lg:gap-[72px] lg:pt-[150px]">
      <Stagger className="flex flex-col gap-5 lg:w-[500px] lg:shrink-0">
        <Item>
          <Eyebrow>Writing modes</Eyebrow>
        </Item>
        <Item as="h2" className={sectionTitle}>
          Choose how it <br className="hidden sm:block" />
          should sound.
        </Item>
        <Item as="p" className="text-[17px] leading-[26px] text-muted">
          Set a default mode and Typefine uses it every time. You can also switch from the result panel when one
          message needs a different tone. What you meant stays the same, only the wording changes.
        </Item>

        <Item as="ul" className="flex flex-col pt-4" aria-label="Writing modes">
          {MODES.map((m, i) => {
            const selected = i === active
            return (
              <li key={m.name}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  aria-pressed={selected}
                  className="group relative flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-left sm:py-[13px]"
                >
                  {selected && (
                    <motion.span
                      layoutId="mode-highlight"
                      className="absolute inset-0 rounded-xl bg-surface"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <motion.span
                    className="relative size-2 shrink-0 rounded-full"
                    initial={false}
                    animate={{ backgroundColor: selected ? '#3b63e0' : '#d3d7de', scale: selected ? 1.15 : 1 }}
                  />
                  <span className="relative flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <span
                      className={`text-base text-ink sm:w-[120px] sm:shrink-0 ${selected ? 'font-semibold' : 'font-medium'}`}
                    >
                      {m.name}
                    </span>
                    <span className="text-sm text-muted transition-colors group-hover:text-ink sm:text-[15px]">
                      {m.description}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </Item>
      </Stagger>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="flex flex-1 flex-col justify-center gap-7 rounded-[28px] bg-surface p-5 py-8 sm:p-10 lg:min-h-[614px] lg:p-14"
      >
        <div className="flex flex-col gap-3">
          <Eyebrow className="text-xs text-muted">You wrote</Eyebrow>
          <p className="text-lg leading-7 tracking-[-0.3px] text-muted sm:text-[22px] sm:leading-8">{ORIGINAL}</p>
        </div>

        <div className="flex items-center gap-2.5" aria-hidden>
          <Key size="sm" pressed={alt}>
            ⌥
          </Key>
          <Key size="sm" pressed={e}>
            E
          </Key>
          <div className="relative h-px flex-1 bg-line-strong">
            <motion.span
              key={switches}
              className="absolute inset-0 origin-left bg-accent"
              initial={{ scaleX: 0, opacity: 1 }}
              animate={switches ? { scaleX: 1, opacity: [1, 1, 0] } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-xs font-medium tracking-[0.5px] text-muted"
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </div>

        <ResultPanel variant="demo" mode={label}>
          <p aria-live="polite">
            <StreamedText key={active} text={mode.result} delay={switches ? 0.45 : 0} step={0.025} />
          </p>
        </ResultPanel>
      </motion.div>
    </section>
  )
}
