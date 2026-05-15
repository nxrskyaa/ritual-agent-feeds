import { useState, useEffect } from 'react'

let subscribers = new Set<() => void>()
let intervalId: ReturnType<typeof setInterval> | null = null

function startInterval() {
  if (intervalId !== null) return
  intervalId = setInterval(() => {
    subscribers.forEach((cb) => cb())
  }, 30_000)
}

function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

export function useLiveTime(): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = () => setNow(Date.now())
    subscribers.add(tick)
    startInterval()

    return () => {
      subscribers.delete(tick)
      if (subscribers.size === 0) {
        stopInterval()
      }
    }
  }, [])

  return now
}
