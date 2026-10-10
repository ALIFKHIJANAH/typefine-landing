import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Command } from 'lucide-react'
import { EASE, useChord } from '../lib/motion'
import { BrandMark, Key } from './ui'
import { LoadingLines, ResultPanel, StreamedText } from './ResultPanel'

const ORIGINAL = 'already check this issue caused by sql api fail and retry too much'
const IMPROVED =
  "I've already checked this issue. It was caused by the SQL API failing repeatedly, which triggered too many retries."

// [phase, how long it holds before moving on]
const TIMELINE = [
  ['idle', 1100],
  ['select', 800],
  ['press', 550],
  ['loading', 950],
  ['result', 3800],
  ['confirm', 380],
  ['replaced', 2600],
]

// The stage is drawn at its design size and scaled to fit. Below MIN_SCALE it crops
// instead, keeping the composer and result panel (around FOCUS_X) in frame.
const CANVAS_W = 1200
const CANVAS_H = 700
const FOCUS_X = 705
const MIN_SCALE = 0.48

function useFit(ref) {
  const [width, setWidth] = useState(CANVAS_W)

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  const scale = Math.min(1, Math.max(width / CANVAS_W, MIN_SCALE))
  const scaled = CANVAS_W * scale
  const x =
    scaled <= width ? (width - scaled) / 2 : Math.min(0, Math.max(width - scaled, width / 2 - FOCUS_X * scale))
  return { scale, x }
}

function useTimeline(running) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % TIMELINE.length), TIMELINE[index][1])
    return () => clearTimeout(timer)
  }, [index, running])

  return TIMELINE[index][0]
}

export function ProductStage() {
  const frameRef = useRef(null)
  const { scale, x } = useFit(frameRef)
  const inView = useInView(frameRef, { amount: 0.35 })
  const reduceMotion = useReducedMotion()
  const timelinePhase = useTimeline(inView && !reduceMotion)
  const phase = reduceMotion ? 'result' : timelinePhase
  const keysDown = useChord(phase === 'press')

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
      className="w-full"
    >
      <div
        ref={frameRef}
        role="img"
        aria-label="Typefine rewriting a selected Slack message: the rough draft is replaced with a clear, natural version."
        className="hairline relative w-full overflow-hidden rounded-[20px] bg-[linear-gradient(-155.33deg,#d9e4ff_17.3%,#ece6ff_50%,#f6f7fa_82.7%)] md:rounded-[28px]"
        style={{ height: CANVAS_H * scale }}
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: CANVAS_W, height: CANVAS_H, transform: `translateX(${x}px) scale(${scale})` }}
        >
          <Desktop phase={phase} />
          <div className="absolute top-[486px] left-6 z-10 hidden md:block">
            <ShortcutCallout down={keysDown} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center md:hidden">
        <ShortcutCallout down={keysDown} />
      </div>
    </motion.div>
  )
}

function ShortcutCallout({ down }) {
  return (
    <div className="hairline-strong flex w-fit items-center gap-3 rounded-2xl bg-white py-2.5 pr-4 pl-2.5 shadow-[0_16px_40px_#0b0d1238]">
      <div className="flex gap-1.5">
        <Key pressed={down[0]}>⌥</Key>
        <Key pressed={down[1]}>E</Key>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-semibold whitespace-nowrap text-ink">Rewrite the selected text</p>
        <p className="text-[13px] whitespace-nowrap text-muted">In any app with a text field</p>
      </div>
    </div>
  )
}

function Desktop({ phase }) {
  const selected = ['select', 'press', 'loading', 'result', 'confirm'].includes(phase)
  const panelOpen = ['loading', 'result', 'confirm'].includes(phase)
  const replaced = phase === 'replaced'

  return (
    <div className="absolute top-14 left-10 h-[660px] w-[1120px] overflow-hidden rounded-2xl bg-[linear-gradient(148.3deg,#101b31_18.3%,#1b1733_56.3%,#0c1120_81.7%)] font-inter outline outline-[#ffffff1f] -outline-offset-[0.5px]">
      <div className="absolute top-[55px] left-[560px] h-80 w-[360px] rounded-full bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,#4e8cff66_0%,#4e8cff00_100%)] blur-[14px]" />
      <div className="absolute top-[315px] left-[120px] h-[220px] w-[300px] rounded-full bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,#a476ff4d_0%,#a476ff00_100%)] blur-[16px]" />

      <MenuBar busy={phase === 'loading'} />

      <div className="absolute top-[66px] left-[66px] z-[3] flex h-[546px] w-[988px] overflow-hidden rounded-xl bg-[#162133b5] shadow-[0_14px_42px_#00000055] outline outline-[#ffffff2b] -outline-offset-[0.5px] backdrop-blur-[11px]">
        <Sidebar />

        <div className="flex flex-1 flex-col gap-6 p-6">
          <p className="text-[19px] text-ui-text"># engineering</p>
          <p className="text-xs text-ui-muted">Backend, deploys and on-call</p>

          <div className="flex gap-3">
            <span className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-[#e6dccf] text-xs font-medium text-[#3d3326]">
              NL
            </span>
            <div className="flex flex-col gap-[7px]">
              <p className="text-xs text-ui-text">
                <span className="font-semibold">Nina Lee</span> <span className="text-ui-muted">9:38 AM</span>
              </p>
              <p className="text-sm leading-[21px] text-ui-text">Hey! Any update on the API issue from this morning?</p>
            </div>
          </div>

          <div className="h-10 shrink-0" />

          <div className="flex h-[140px] shrink-0 flex-col gap-3.5 rounded-lg p-3.5 outline outline-[#cfd4dc] -outline-offset-[0.5px]">
            <p className="text-[13px] tracking-[0.3em] text-ui-muted">B I ↗ ≡ ☷ &lt;/&gt;</p>
            <div className="relative p-[3px]">
              <motion.span
                className="absolute inset-0 origin-left bg-[#4269d0]/60"
                initial={false}
                animate={{ scaleX: selected ? 1 : 0 }}
                transition={selected ? { duration: 0.65, ease: [0.65, 0, 0.35, 1] } : { duration: 0.15 }}
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={replaced ? 'improved' : 'original'}
                  className="relative text-sm leading-[21px] text-ui-text"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  {replaced ? IMPROVED : ORIGINAL}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-auto text-[15px] tracking-[0.35em] text-ui-muted">＋ ☺ @</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="absolute top-[355px] left-[536px] z-[4]"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <ResultPanel mode="Enhance" busy={phase === 'loading'} replacePressed={phase === 'confirm'}>
              {phase === 'loading' ? <LoadingLines /> : <StreamedText text={IMPROVED} />}
            </ResultPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuBar({ busy }) {
  return (
    <div className="absolute top-0 left-0 z-[2] flex h-[30px] w-full items-center gap-[22px] bg-[#182437aa] px-[18px] text-ui-text backdrop-blur-[10px]">
      <Command className="size-3.5" />
      <span className="text-xs font-semibold">Slack</span>
      <span className="flex gap-4 text-[11px]">
        {['File', 'Edit', 'View', 'Window', 'Help'].map((menu) => (
          <span key={menu}>{menu}</span>
        ))}
      </span>
      <span className="flex-1" />
      <motion.span
        animate={busy ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
        transition={busy ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }}
      >
        <BrandMark className="size-[15px]" />
      </motion.span>
      <span className="flex gap-3 text-[11px]">
        <span>⌁ 100%</span>
        <span>Mon 9 Jun</span>
        <span>9:41</span>
      </span>
    </div>
  )
}

function Sidebar() {
  return (
    <div className="glass-chip flex h-full w-[218px] shrink-0 flex-col gap-[23px] p-5">
      <div className="flex gap-2">
        {['#ef7772', '#efc15c', '#75c886'].map((color) => (
          <span key={color} className="size-[11px] rounded-full" style={{ background: color }} />
        ))}
      </div>
      <p className="text-[17px] text-ui-text">Halfmoon ⌄</p>
      <ul className="text-[13px] leading-5 text-ui-muted">
        <li>Threads</li>
        <li>Drafts &amp; sent</li>
      </ul>
      <p className="text-[11px] text-ui-muted">Channels</p>
      <ul className="-mx-2 text-[13px] leading-5 text-ui-text">
        {['general', 'engineering', 'product', 'releases'].map((channel) => (
          <li
            key={channel}
            className={`rounded-md px-2 ${channel === 'engineering' ? 'bg-white/10 font-medium' : ''}`}
          >
            #&nbsp;&nbsp;{channel}
          </li>
        ))}
      </ul>
    </div>
  )
}
