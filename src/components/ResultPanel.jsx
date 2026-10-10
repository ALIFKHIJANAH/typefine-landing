import { motion } from 'motion/react'
import { Cloud, X } from 'lucide-react'
import { BrandMark } from './ui'

const VARIANTS = {
  stage: {
    box: 'w-[486px] rounded-[13px] bg-[#192437d9] p-[18px]',
    text: 'min-h-[52px] text-[17px] leading-[26px]',
  },
  demo: {
    box: 'w-full rounded-2xl bg-[#141b28] p-4 sm:p-[22px]',
    text: 'min-h-[87px] text-[17px] leading-[26px] sm:text-[19px] sm:leading-[29px]',
  },
}

const chip = 'glass-chip flex h-[34px] shrink-0 items-center rounded-[7px] px-3 text-xs whitespace-nowrap text-ui-text'

// The floating Typefine result window, as it appears over other apps.
export function ResultPanel({ variant = 'stage', mode, replacePressed = false, busy = false, children }) {
  const v = VARIANTS[variant]
  return (
    <div
      className={`flex flex-col gap-4 font-inter shadow-[0_18px_45px_#00000066] outline outline-[#ffffff4a] -outline-offset-[0.5px] backdrop-blur-[15px] ${v.box}`}
    >
      <div className="flex items-center gap-[9px]">
        <motion.span
          animate={busy ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={busy ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }}
        >
          <BrandMark className="size-[18px]" />
        </motion.span>
        <span className="text-[13px] text-ui-text">Typefine</span>
        <span className="flex-1" />
        <span className={chip}>{mode} ⌄</span>
        <X className="size-[15px] text-ui-dim" aria-hidden />
      </div>

      <div className={`text-ui-text ${v.text}`}>{children}</div>

      <div className="flex items-center gap-1.5">
        <Cloud className="size-3 text-ui-dim" aria-hidden />
        <span className="text-[10px] text-ui-muted">Processed by OpenAI · gpt-4.1-mini</span>
      </div>

      <div className="flex items-center gap-2">
        <motion.span
          animate={replacePressed ? { scale: 0.93, filter: 'brightness(1.25)' } : { scale: 1, filter: 'brightness(1)' }}
          transition={{ duration: 0.18 }}
          className="flex h-[34px] shrink-0 items-center rounded-[7px] bg-ui-button px-3 text-xs whitespace-nowrap text-ui-text"
        >
          Replace ↵
        </motion.span>
        <span className={chip}>Copy ⌘C</span>
        <span className={chip}>Retry ⌘R</span>
        <span className="flex-1" />
        <span className="text-[11px] text-ui-muted">esc</span>
      </div>
    </div>
  )
}

// Reveals a sentence word by word, the way a streamed response lands.
export function StreamedText({ text, delay = 0, step = 0.035 }) {
  return (
    <span>
      <span className="sr-only">{text}</span>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, filter: 'blur(4px)', y: 3 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.35, delay: delay + i * step }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </span>
  )
}

export function LoadingLines() {
  return (
    <span className="flex flex-col gap-2.5 pt-1.5">
      <span className="sr-only">Rewriting…</span>
      {['92%', '64%'].map((width, i) => (
        <motion.span
          key={width}
          className="block h-3 rounded-full bg-white/15"
          style={{ width }}
          animate={{ opacity: [0.35, 0.8, 0.35] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  )
}
