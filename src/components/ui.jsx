import { useId } from 'react'
import { motion } from 'motion/react'
import { CirclePlay } from 'lucide-react'
import { DOWNLOAD_URL } from '../config'
import { EASE, fadeUp } from '../lib/motion'
import { useOpenDemo } from './DemoVideo'

// The "T." logo, drawn on the same 8-unit grid as the source artwork.
export function BrandMark({ className = 'size-7' }) {
  const gradientId = `tf-mark-${useId().replace(/[^\w-]/g, '')}`
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={`shrink-0 ${className}`}>
      <defs>
        <linearGradient id={gradientId} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#5a80f0" />
          <stop offset="1" stopColor="#2d50cc" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="27" fill={`url(#${gradientId})`} />
      <path fill="#fff" d="M30 30h40v8H54v32h-8V38H30zM62 62h8v8h-8z" />
    </svg>
  )
}

export function Brand({ className = '' }) {
  return (
    <a href="#top" className={`flex w-fit items-center gap-2.5 ${className}`}>
      <BrandMark />
      <span className="text-lg font-semibold tracking-[-0.4px] text-ink">Typefine</span>
    </a>
  )
}

const KEY_SIZES = {
  sm: { box: 'size-[34px] rounded-[8px] text-[15px]', depth: 2 },
  md: { box: 'size-[44px] rounded-[10px] text-[18px]', depth: 2 },
  lg: { box: 'size-[52px] rounded-[12px] text-[22px] md:size-[64px] md:rounded-[14px] md:text-[26px]', depth: 4 },
  xl: { box: 'size-[64px] rounded-[14px] text-[26px] md:size-[76px] md:rounded-[16px] md:text-[30px]', depth: 4 },
}

export function Key({ children, size = 'md', pressed = false }) {
  const { box, depth } = KEY_SIZES[size]
  return (
    <motion.kbd
      initial={false}
      animate={{ y: pressed ? depth : 0, boxShadow: `0 ${pressed ? 0 : depth}px 0 #d3d7de` }}
      transition={{ type: 'spring', stiffness: 800, damping: 32 }}
      className={`hairline-strong flex shrink-0 items-center justify-center bg-white font-mono font-medium text-ink ${box}`}
    >
      {children}
    </motion.kbd>
  )
}

const BUTTON_SIZES = {
  sm: 'h-[38px] gap-2 px-4 text-sm [&_svg]:size-3.5',
  lg: 'h-[52px] gap-2.5 px-6 text-base [&_svg]:size-[17px]',
}

const press = { whileHover: { y: -1 }, whileTap: { scale: 0.97 }, transition: { duration: 0.2, ease: EASE } }

export function DownloadButton({ size = 'lg', label = 'Download for macOS' }) {
  return (
    <motion.a
      href={DOWNLOAD_URL}
      {...press}
      className={`inline-flex shrink-0 items-center rounded-full bg-ink font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#1d2129] ${BUTTON_SIZES[size]}`}
    >
      {label}
    </motion.a>
  )
}

export function DemoButton() {
  const openDemo = useOpenDemo()
  return (
    <motion.button
      type="button"
      onClick={openDemo}
      {...press}
      className={`hairline-strong inline-flex shrink-0 items-center rounded-full px-[22px] font-medium whitespace-nowrap text-ink transition-colors hover:bg-surface ${BUTTON_SIZES.lg}`}
    >
      <CirclePlay aria-hidden />
      Watch 30-sec demo
    </motion.button>
  )
}

export function Eyebrow({ children, className = 'text-muted' }) {
  return <p className={`font-mono text-[13px] font-medium tracking-[1px] uppercase ${className}`}>{children}</p>
}

export const sectionTitle =
  'text-[clamp(2.25rem,4.6vw,3.375rem)] leading-[1.06] font-semibold tracking-[-0.04em] text-balance'

// Fades children up as a group once they scroll into view.
export function Stagger({ as = 'div', className, children, gap = 0.08, delay = 0, amount = 0.25 }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  )
}

export function Item({ as = 'div', className, children, variants = fadeUp, ...rest }) {
  const Comp = motion[as]
  return (
    <Comp className={className} variants={variants} {...rest}>
      {children}
    </Comp>
  )
}
