import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { EASE } from '../lib/motion'

const OpenDemoContext = createContext(() => {})

// Wide screens get the 16:9 cut, tall ones (phones, portrait tablets) the 9:16 cut.
// Each box fits the viewport on both axes, leaving room for the close button.
const VIDEOS = {
  landscape: {
    src: '/typefine.mp4',
    poster: '/typefine-poster.jpg',
    size: 'aspect-video w-[min(calc(100vw-32px),calc((100dvh-96px)*16/9),1280px)]',
  },
  portrait: {
    src: '/typefine-vertical.mp4',
    poster: '/typefine-vertical-poster.jpg',
    size: 'aspect-[9/16] h-[min(calc(100dvh-96px),calc((100vw-32px)*16/9))]',
  },
}

export const useOpenDemo = () => useContext(OpenDemoContext)

export function DemoVideoProvider({ children }) {
  const [open, setOpen] = useState(false)
  const returnFocus = useRef(null)

  const openDemo = useCallback(() => {
    returnFocus.current = document.activeElement
    setOpen(true)
  }, [])

  const closeDemo = () => {
    setOpen(false)
    returnFocus.current?.focus({ preventScroll: true })
  }

  return (
    <OpenDemoContext.Provider value={openDemo}>
      {children}
      <AnimatePresence>{open && <DemoDialog onClose={closeDemo} />}</AnimatePresence>
    </OpenDemoContext.Provider>
  )
}

function DemoDialog({ onClose }) {
  const dialogRef = useRef(null)
  const videoRef = useRef(null)
  // Picked once per open so rotating the device mid-play doesn't restart the video.
  const [video] = useState(() => VIDEOS[matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'])

  // Leave the modal state first so the page is interactive again (focus can return to the
  // trigger) while the fade-out plays.
  const dismiss = () => {
    dialogRef.current?.close()
    onClose()
  }

  useLayoutEffect(() => {
    dialogRef.current.showModal()
    document.documentElement.style.overflow = 'hidden'

    // Some browsers refuse unmuted autoplay even after a click; fall back to muted.
    const player = videoRef.current
    player.play().catch(() => {
      player.muted = true
      player.play().catch(() => {})
    })

    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <motion.dialog
      ref={dialogRef}
      aria-label="Typefine demo video"
      onCancel={(event) => {
        event.preventDefault()
        dismiss()
      }}
      onClick={(event) => event.target === event.currentTarget && dismiss()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] m-0 flex size-full max-h-none max-w-none items-center justify-center bg-ink/80 p-4 backdrop-blur-md backdrop:bg-transparent"
    >
      <button
        type="button"
        autoFocus
        onClick={dismiss}
        aria-label="Close demo"
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      <motion.video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        controls
        playsInline
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`block rounded-2xl bg-black shadow-[0_24px_80px_#00000080] ${video.size}`}
      />
    </motion.dialog>
  )
}
