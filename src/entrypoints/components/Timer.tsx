import { useEffect, useState } from 'react'

export default function Counter({
  isCounting,
}: Readonly<{ isCounting: boolean }>) {
  const [count, setCount] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const startCounting = () => {
    const id = setInterval(() => {
      setCount((prevCount) => prevCount + 1)
    }, 1000)
    setIntervalId(id)
  }

  const stopCounting = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setCount(0)
    }
  }

  const formatTimeUnit = (unit: number) => {
    return unit < 10 ? `0${unit}` : `${unit}`
  }

  const seconds = count % 60
  const minutes = Math.floor(count / 60) % 60
  const hours = Math.floor(count / 3600)

  useEffect(() => {
    if (!isCounting) {
      stopCounting()
    } else {
      startCounting()
    }
  }, [isCounting])

  return (
    <div>
      <p>
        {formatTimeUnit(hours)}:{formatTimeUnit(minutes)}:
        {formatTimeUnit(seconds)}
      </p>
    </div>
  )
}
