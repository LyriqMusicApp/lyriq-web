'use client'

import { useEffect, useState } from 'react'
import { Music } from 'lucide-react'

const STAGES = [
  { message: 'Writing lyrics…', duration: 10000 },
  { message: 'Composing the melody…', duration: 12000 },
  { message: 'Recording vocals…', duration: 15000 },
  { message: 'Mixing and mastering…', duration: 13000 },
  { message: 'Almost done…', duration: 99999 },
]

export function GenerateProgress() {
  const [stageIndex, setStageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Advance through stage messages
  useEffect(() => {
    let elapsed = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    STAGES.forEach((stage, i) => {
      timers.push(setTimeout(() => setStageIndex(i), elapsed))
      elapsed += stage.duration
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  // Smooth progress bar — fills to 96% over 55 seconds, never reaches 100
  useEffect(() => {
    const total = 55000
    const interval = 200
    const increment = (96 / total) * interval
    let current = 0

    const timer = setInterval(() => {
      current = Math.min(current + increment, 96)
      setProgress(current)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const stage = STAGES[stageIndex]

  return (
    <div className="flex flex-col items-center py-16 px-8 text-center">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #5B47FB, #3D2EE3)',
            boxShadow: '0 8px 32px rgba(91,71,251,0.4)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <Music className="w-9 h-9 text-white" />
        </div>
        {/* Ripple rings */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            border: '2px solid rgba(91,71,251,0.3)',
            animation: 'ripple 2s ease-out infinite',
            transform: 'scale(1)',
          }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            border: '2px solid rgba(91,71,251,0.15)',
            animation: 'ripple 2s ease-out infinite 0.5s',
          }}
        />
      </div>

      <h2 className="text-2xl font-bold mb-2" style={{ color: '#101828' }}>
        Creating your song
      </h2>
      <p className="text-base mb-2 h-6 transition-all duration-500" style={{ color: '#5B47FB', fontWeight: 500 }}>
        {stage.message}
      </p>
      <p className="text-sm mb-10" style={{ color: '#98A2B3' }}>
        This takes about 30–60 seconds — sit tight
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E4E7EC' }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #5B47FB, #3D2EE3)',
            }}
          />
        </div>
        <p className="text-xs mt-2 text-right" style={{ color: '#98A2B3' }}>
          {Math.round(progress)}%
        </p>
      </div>

      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  )
}
