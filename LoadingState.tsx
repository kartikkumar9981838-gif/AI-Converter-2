'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'Reading your theme...',
  'Mapping structure...',
  'Building Blogger XML...',
  'Almost ready...',
]

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* Violet progress bar across top */}
      <div
        className="fixed top-0 left-0 h-0.5 animate-progress"
        style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)', zIndex: 100 }}
      />

      {/* Spinning ring */}
      <div
        className="animate-spin-ring"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid rgba(124,58,237,0.2)',
          borderTopColor: '#7c3aed',
        }}
      />

      {/* Cycling text */}
      <p
        key={msgIndex}
        className="text-sm font-medium animate-fade-in-up"
        style={{ color: '#a855f7', fontFamily: 'var(--font-body)' }}
      >
        {MESSAGES[msgIndex]}
      </p>

      <p className="text-xs" style={{ color: '#4a4a6a' }}>
        This may take a few seconds...
      </p>
    </div>
  )
}
