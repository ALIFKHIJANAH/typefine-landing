import { motion } from 'motion/react'
import { Cloud, History, KeyRound, Laptop, Lock, LockKeyhole, MousePointerClick } from 'lucide-react'
import { EASE } from '../lib/motion'
import { Eyebrow, Item, Stagger, sectionTitle } from './ui'

const PRINCIPLES = [
  {
    Icon: MousePointerClick,
    title: 'Only when you press ⌥E',
    body: 'Typefine doesn’t read anything in the background, and it never logs your keystrokes.',
  },
  {
    Icon: KeyRound,
    title: 'You bring the API key',
    body: 'You connect your own provider. Your text goes straight to them, not through us.',
  },
  {
    Icon: LockKeyhole,
    title: 'Keys stay in your Keychain',
    body: 'Your API key is encrypted and stored in the macOS Keychain.',
  },
  {
    Icon: History,
    title: 'History is off by default',
    body: 'Typefine doesn’t keep your text unless you turn history on.',
  },
]

const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.6 } }

// Draws the path from Mac to provider in order, so the direction of travel is the point.
const line = (delay) => ({
  variants: {
    hidden: { scale: 0 },
    show: { scale: 1, transition: { duration: 0.55, ease: EASE, delay } },
  },
})

// Vertical under the Mac icon on phones, horizontal between the endpoints from md up.
const connector =
  'ml-[21.5px] block h-6 w-px origin-top bg-white/18 md:ml-0 md:h-px md:w-auto md:flex-1 md:origin-left'

export function Privacy() {
  return (
    <section id="privacy" className="container-page pt-24 lg:pt-[150px]">
      <div className="relative flex flex-col gap-12 overflow-hidden rounded-[24px] bg-ink px-6 py-12 outline outline-line -outline-offset-[0.5px] md:gap-14 md:rounded-[32px] md:p-[72px]">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute -top-[220px] -right-[180px] h-[520px] w-[620px] rounded-full bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,#4c7dff55_0%,#4c7dff00_100%)] blur-[20px]"
        />

        <Stagger className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Item className="flex flex-col gap-5">
            <Eyebrow className="text-night-muted">Privacy</Eyebrow>
            <h2 className={`${sectionTitle} text-night-text`}>Typefine only sees what you select.</h2>
          </Item>
          <Item as="p" className="max-w-[420px] text-[17px] leading-[26px] text-night-muted">
            And only after you press ⌥E. The request goes straight from your Mac to the AI provider you connected,
            without passing through our servers.
          </Item>
        </Stagger>

        <motion.div
          {...inView}
          className="relative flex flex-col items-start gap-4 rounded-[20px] bg-white/[0.03] px-6 py-7 outline outline-white/8 -outline-offset-[0.5px] md:flex-row md:items-center md:gap-5 md:px-8"
        >
          <Endpoint Icon={Laptop} title="Your Mac" detail="Typefine runs locally" />

          <div className="flex flex-col items-start gap-3 self-stretch md:flex-1 md:flex-row md:items-center">
            <motion.span {...line(0.2)} className={connector} />
            <motion.span
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE, delay: 0.65 } },
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 outline outline-white/14 -outline-offset-[0.5px]"
            >
              <Lock className="size-3 text-accent-soft" aria-hidden />
              <span className="font-mono text-xs whitespace-nowrap text-night-text">Selected text only</span>
            </motion.span>
            <motion.span {...line(0.95)} className={connector} />
          </div>

          <motion.div
            variants={{ hidden: { opacity: 0.35 }, show: { opacity: 1, transition: { duration: 0.5, delay: 1.35 } } }}
          >
            <Endpoint Icon={Cloud} title="Your AI provider" detail="Connected with your own key" />
          </motion.div>
        </motion.div>

        <Stagger as="ul" gap={0.09} className="relative grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map(({ Icon, title, body }) => (
            <Item as="li" key={title} className="flex flex-col gap-2.5 border-t border-white/12 pt-6">
              <Icon className="size-5 text-accent-soft" aria-hidden />
              <h3 className="text-[17px] font-semibold text-night-text">{title}</h3>
              <p className="text-[15px] leading-[23px] text-night-muted">{body}</p>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function Endpoint({ Icon, title, detail }) {
  return (
    <div className="flex shrink-0 items-center gap-3.5">
      <span className="flex size-11 items-center justify-center rounded-xl bg-white/6 outline outline-white/12 -outline-offset-[0.5px]">
        <Icon className="size-5 text-night-text" aria-hidden />
      </span>
      <span className="flex flex-col gap-[3px]">
        <span className="text-base font-semibold text-night-text">{title}</span>
        <span className="text-sm text-night-muted">{detail}</span>
      </span>
    </div>
  )
}
