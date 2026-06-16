'use client'

import { useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

const XMLBracketCanvas = dynamic(() => import('./XMLBracketCanvas'), { ssr: false })

interface UploadZoneProps {
  onFileSelected: (content: string, name: string, type: string, size: number) => void
  error: string | null
}

const ACCEPTED_EXTENSIONS = ['.html', '.css', '.xml', '.json']
const MAX_SIZE_BYTES = 500 * 1024 // 500KB

function getFileType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const map: Record<string, string> = {
    html: 'HTML Theme',
    css: 'Stylesheet',
    xml: 'XML Template',
    json: 'JSON Config',
  }
  return map[ext] || ext.toUpperCase()
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export default function UploadZone({ onFileSelected, error }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; type: string } | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const processFile = useCallback((file: File) => {
    setLocalError(null)

    if (file.name.endsWith('.zip') || file.type === 'application/zip') {
      setLocalError('ZIP files are not supported. Please extract your theme file first.')
      return
    }

    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '')
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setLocalError(`Unsupported file type. Please use: ${ACCEPTED_EXTENSIONS.join(', ')}`)
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setLocalError(`File too large. Maximum size is 500KB (your file: ${formatSize(file.size)})`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSelectedFile({ name: file.name, size: file.size, type: getFileType(file.name) })
      onFileSelected(content, file.name, getFileType(file.name), file.size)
    }
    reader.readAsText(file)
  }, [onFileSelected])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const handleBrowse = () => fileInputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const displayError = localError || error

  return (
    <div
      className={`glass-card p-6 upload-zone transition-all duration-200 ${isDragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Small 3D canvas */}
      <div className="flex justify-center mb-4">
        <XMLBracketCanvas />
      </div>

      {/* Drop area */}
      <div
        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200"
        style={{
          borderColor: isDragOver ? '#7c3aed' : '#1e1e35',
          background: isDragOver ? 'rgba(124,58,237,0.05)' : 'transparent',
        }}
        onClick={handleBrowse}
      >
        {/* Upload icon */}
        <svg
          className="mx-auto mb-3"
          width="36"
          height="36"
          fill="none"
          viewBox="0 0 24 24"
          stroke={isDragOver ? '#7c3aed' : '#8b8ba8'}
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>

        {selectedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" stroke="#10b981" />
              </svg>
              <span className="font-mono text-sm" style={{ color: '#f1f0ff' }}>{selectedFile.name}</span>
            </div>
            <div className="flex justify-center gap-4 text-xs" style={{ color: '#8b8ba8' }}>
              <span>{selectedFile.type}</span>
              <span>·</span>
              <span>{formatSize(selectedFile.size)}</span>
            </div>
            <p className="text-xs mt-2" style={{ color: '#8b8ba8' }}>Click to change file</p>
          </div>
        ) : (
          <>
            <p className="font-medium mb-1" style={{ color: '#f1f0ff' }}>Drop your theme file</p>
            <p className="text-xs mb-1" style={{ color: '#8b8ba8' }}>or click to browse</p>
            <p className="section-label mt-2">.html .css .xml .json</p>
          </>
        )}
      </div>

      {/* Max size note */}
      <p className="text-center text-xs mt-2" style={{ color: '#4a4a6a' }}>
        Max 500KB · Free conversion powered by Gemini
      </p>

      {/* Error message */}
      {displayError && (
        <div
          className="mt-3 rounded-lg px-4 py-3 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
        >
          {displayError}
        </div>
      )}

      {/* Browse button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.css,.xml,.json"
        className="hidden"
        onChange={handleInputChange}
      />

      <button className="btn-ghost w-full mt-4" onClick={handleBrowse}>
        Browse File
      </button>
    </div>
  )
}
