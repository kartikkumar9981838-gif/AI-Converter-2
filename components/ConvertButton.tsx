'use client'

interface ConvertButtonProps {
  onClick: () => void
  disabled: boolean
  fileName: string
}

export default function ConvertButton({ onClick, disabled, fileName }: ConvertButtonProps) {
  return (
    <button
      className="btn-violet w-full mt-4 flex items-center justify-center gap-2 animate-slide-up"
      onClick={onClick}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
      Convert to Blogger XML
    </button>
  )
}
