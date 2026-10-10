import { useEffect, useState } from 'react'

export const EASE = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

// Presses ⌥ then E, then releases both. Replays whenever `trigger` changes to a truthy value.
export function useChord(trigger, delay = 0) {
  const [down, setDown] = useState([false, false])

  useEffect(() => {
    if (!trigger) return
    const timers = [
      setTimeout(() => setDown([true, false]), delay),
      setTimeout(() => setDown([true, true]), delay + 140),
      setTimeout(() => setDown([false, false]), delay + 520),
    ]
    return () => timers.forEach(clearTimeout)
  }, [trigger, delay])

  return down
}
