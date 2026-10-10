import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { EASE, useChord } from '../lib/motion'
import { Eyebrow, Item, Key, Stagger, sectionTitle } from './ui'

const STEPS = [
  {
    number: '01',
    title: 'Select',
    body: 'Highlight the text you want to fix: a Slack reply, an email draft, a commit message, part of a doc.',
    Visual: SelectVisual,
    delay: 0.2,
  },
  {
    number: '02',
    title: 'Press ⌥E',
    body: 'Typefine reads only what you selected and rewrites it using the mode you picked.',
    Visual: PressVisual,
    delay: 1.05,
  },
  {
    number: '03',
    title: 'Replace',
    body: 'Read the result. Press Enter to swap it in, or Esc to leave your original text alone.',
    Visual: ReplaceVisual,
    delay: 1.7,
  },
]

export function HowItWorks() {
  const stepsRef = useRef(null)
  const inView = useInView(stepsRef, { once: true, amount: 0.4 })

  return (
    <section id="how-it-works" className="container-page flex flex-col gap-10 pt-24 md:gap-14 lg:pt-[150px]">
      <Stagger className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <Item className="flex flex-col gap-5">
          <Eyebrow>How it works</Eyebrow>
          <h2 className={sectionTitle}>
            You never have to leave <br className="hidden sm:block" />
            the text box.
          </h2>
        </Item>
        <Item as="p" className="max-w-[400px] text-[17px] leading-[26px] text-muted">
          No copying your draft into a chat window and pasting the answer back. Typefine works inside whatever app
          you’re typing in.
        </Item>
      </Stagger>

      <div ref={stepsRef}>
        <Stagger
          as="ol"
          gap={0.1}
          className="hairline grid divide-y divide-line overflow-hidden rounded-3xl md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {STEPS.map((step) => (
            <Step key={step.number} {...step} start={inView} />
          ))}
        </Stagger>
      </div>
    </section>
  )
}

// Each step plays its demo once in sequence, and replays when hovered.
function Step({ number, title, body, Visual, delay, start }) {
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!start) return
    const timer = setTimeout(() => setRun(1), delay * 1000)
    return () => clearTimeout(timer)
  }, [start, delay])

  return (
    <Item as="li" className="flex flex-col" onPointerEnter={() => run && setRun((r) => r + 1)}>
      <div className="flex h-[200px] items-center justify-center bg-surface p-6 md:h-[240px] md:p-8" aria-hidden>
        <Visual run={run} />
      </div>
      <div className="flex flex-col gap-2.5 px-6 pt-7 pb-9 md:px-8">
        <p className="font-mono text-[13px] font-medium text-muted">{number}</p>
        <h3 className="text-[22px] font-semibold tracking-[-0.5px] text-ink">{title}</h3>
        <p className="text-base leading-6 text-muted">{body}</p>
      </div>
    </Item>
  )
}

function SelectVisual({ run }) {
  return (
    <div className="hairline flex w-full flex-col gap-1.5 rounded-[14px] bg-white p-5">
      <p className="text-[15px] text-muted md:text-base">Quick update for the team:</p>
      <p className="relative w-fit px-1 py-0.5 text-[15px] text-ink md:text-base">
        <motion.span
          key={run}
          className="absolute inset-0 origin-left rounded bg-accent/12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: run ? 1 : 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
        <span className="relative">we fixed it but its still kinda slow</span>
        <motion.span
          key={`caret-${run}`}
          className="relative ml-px inline-block h-5 w-0.5 translate-y-1 bg-accent"
          animate={run ? { opacity: [1, 0, 1, 0, 1] } : { opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.7 }}
        />
      </p>
    </div>
  )
}

function PressVisual({ run }) {
  const [alt, e] = useChord(run)
  return (
    <div className="flex items-center gap-3.5">
      <Key size="xl" pressed={alt}>
        ⌥
      </Key>
      <span className="text-[22px] text-subtle">+</span>
      <Key size="xl" pressed={e}>
        E
      </Key>
    </div>
  )
}

function ReplaceVisual({ run }) {
  return (
    <div className="hairline flex w-full flex-col gap-4 rounded-[14px] bg-white p-5">
      <motion.p
        key={run}
        initial={{ opacity: 0, filter: 'blur(6px)' }}
        animate={run ? { opacity: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.6 }}
        className="text-base leading-[23px] text-ink"
      >
        We’ve fixed it, but it’s still a little slow.
      </motion.p>
      <div className="flex gap-2">
        <motion.span
          key={`replace-${run}`}
          animate={run ? { scale: [1, 1, 0.93, 1] } : {}}
          transition={{ duration: 0.9, times: [0, 0.6, 0.75, 1], delay: 0.3 }}
          className="flex h-8 items-center rounded-lg bg-accent px-3 text-[13px] font-semibold whitespace-nowrap text-white"
        >
          Replace ↵
        </motion.span>
        <span className="hairline-strong flex h-8 items-center rounded-lg px-3 text-[13px] font-medium whitespace-nowrap text-ink">
          Copy ⌘C
        </span>
      </div>
    </div>
  )
}
