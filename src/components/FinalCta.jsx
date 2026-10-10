import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useChord } from '../lib/motion'
import { DemoButton, DownloadButton, Item, Key, Stagger } from './ui'

export function FinalCta() {
  const keysRef = useRef(null)
  const keysInView = useInView(keysRef, { once: true, amount: 1 })
  const [alt, e] = useChord(keysInView, 700)

  return (
    <section id="download" className="container-page pt-24 lg:pt-[150px]">
      <Stagger
        gap={0.1}
        amount={0.4}
        className="hairline flex flex-col items-center gap-7 overflow-hidden rounded-[24px] bg-[linear-gradient(29.47deg,#d9e4ff_20.9%,#ece6ff_50%,#f6f7fa_79.1%)] px-6 py-16 text-center md:rounded-[32px] md:px-[72px] md:py-24"
      >
        <Item className="flex gap-3 pb-2" aria-hidden>
          <div ref={keysRef} className="flex gap-3">
            <Key size="lg" pressed={alt}>
              ⌥
            </Key>
            <Key size="lg" pressed={e}>
              E
            </Key>
          </div>
        </Item>
        <Item
          as="h2"
          className="text-[clamp(2.5rem,5.6vw,4.25rem)] leading-[1.04] font-semibold tracking-[-0.044em] text-balance text-ink"
        >
          Try it on your <br className="hidden sm:block" />
          next message.
        </Item>
        <Item as="p" className="max-w-[520px] text-[17px] leading-[27px] text-balance text-muted md:text-lg">
          Download Typefine, connect your AI provider, then select something you wrote and press ⌥E.
        </Item>
        <Item className="flex flex-wrap justify-center gap-3">
          <DownloadButton />
          <DemoButton />
        </Item>
      </Stagger>
    </section>
  )
}
