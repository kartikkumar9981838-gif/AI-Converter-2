'use client'

import { useState, useCallback } from 'react'

interface ResultPanelProps {
  xml: string
  fileName: string
}

function highlightXML(xml: string): string {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w:.-]+)/g, '<span class="xml-tag">$1$2</span>')
    .replace(/ ([\w:.-]+)=/g, ' <span class="xml-attr">$1</span>=')
    .replace(/=&quot;([^&]*)&quot;/g, '=<span class="xml-value">&quot;$1&quot;</span>')
    .replace(/=&apos;([^&]*)&apos;/g, '=<span class="xml-value">&apos;$1&apos;</span>')
    .replace(/(&lt;!--.*?--&gt;)/gs, '<span class="xml-comment">$1</span>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

export default function ResultPanel({ xml, fileName }: ResultPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = useCallback(() => {
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'theme.xml'
    a.click()
    URL.revokeObjectURL(url)
  }, [xml])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(xml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [xml])

  // Simple safe syntax highlight
  const highlighted = xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Tags
    .replace(/(&lt;\/?)([\w:.-]+)/g, (_m, p1, p2) =>
      `<span style="color:#06b6d4">${p1}${p2}</span>`
    )
    // Attributes
    .replace(/ ([\w:.-]+)=/g, (_m, attr) =>
      ` <span style="color:#a855f7">${attr}</span>=`
    )
    // Values in quotes (both " and &apos;)
    .replace(/=&quot;([^&]*)&quot;/g, (_m, val) =>
      `=&quot;<span style="color:#10b981">${val}</span>&quot;`
    )
    .replace(/='([^']*)'/g, (_m, val) =>
      `='<span style="color:#10b981">${val}</span>'`
    )

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" stroke="#10b981" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: '#10b981' }}>Conversion Complete</h3>
          <p className="text-xs" style={{ color: '#8b8ba8' }}>From: {fileName}</p>
        </div>
      </div>

      {/* Code preview */}
      <div className="code-preview mb-5">
        <pre
          style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#f1f0ff' }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>

      {/* Download button — primary */}
      <button
        className="btn-violet w-full mb-3 animate-glow-pulse flex items-center justify-center gap-2"
        onClick={handleDownload}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        ↓ Download theme.xml
      </button>

      {/* Copy button */}
      <button
        className="btn-ghost w-full flex items-center justify-center gap-2"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" stroke="#10b981" />
            </svg>
            <span style={{ color: '#10b981' }}>Copied!</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            Copy to Clipboard
          </>
        )}
      </button>

      {/* Upload tip */}
      <div
        className="mt-4 rounded-lg px-4 py-3 text-xs"
        style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)', color: '#8b8ba8' }}
      >
        <span style={{ color: '#06b6d4' }}>→</span> To upload: Blogger Dashboard → Theme → ☰ → Edit HTML → Upload file
      </div>
    </div>
  )
}
