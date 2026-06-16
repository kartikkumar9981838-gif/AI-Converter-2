'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import UploadZone from '@/components/UploadZone'
import LoadingState from '@/components/LoadingState'
import ResultPanel from '@/components/ResultPanel'
import ConvertButton from '@/components/ConvertButton'

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), { ssr: false })

export default function Home() {
  const [fileContent, setFileContent] = useState('')
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasFile, setHasFile] = useState(false)

  const handleFileSelected = (content: string, name: string) => {
    setFileContent(content)
    setFileName(name)
    setHasFile(true)
    setResult(null)
    setError(null)
  }

  const handleConvert = async () => {
    if (!fileContent || !fileName) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileContent, fileName }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Conversion failed. Please try again.')
      } else {
        setResult(data.xml)
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToTool = () => {
    document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main style={{ background: '#04040a', minHeight: '100vh' }}>

      {/* ─── HERO SECTION ─── */}
      <section
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ height: '100vh', minHeight: 600 }}
      >
        {/* Three.js background */}
        <HeroCanvas />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          {/* Pill badge */}
          <div className="hero-line-1 flex justify-center mb-6">
            <span className="pill-badge">✦ Blogger XML Converter</span>
          </div>

          {/* Headline */}
          <h1
            className="hero-line-2 gradient-text font-display font-bold mb-4"
            style={{
              fontSize: 'clamp(40px, 7vw, 72px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Drop Any Theme.<br />Get Blogger XML.
          </h1>

          {/* Subheadline */}
          <p
            className="hero-line-3 font-body mb-8 mx-auto"
            style={{ color: '#8b8ba8', fontSize: 16, maxWidth: 520, lineHeight: 1.7 }}
          >
            Upload HTML, CSS, or XML — XMLorph converts it into a valid
            Blogger v2 theme that actually uploads.
          </p>

          {/* CTA buttons */}
          <div className="hero-line-4 flex flex-wrap items-center justify-center gap-4">
            <button className="btn-violet" onClick={scrollToTool}>
              Convert Now →
            </button>
            <button
              className="btn-ghost"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle cursor-pointer"
          style={{ color: '#4a4a6a' }}
          onClick={scrollToTool}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ─── MAIN TOOL SECTION ─── */}
      <section id="tool" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="section-label mb-3">The Converter</p>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: 32, color: '#f1f0ff', letterSpacing: '-0.02em' }}
            >
              Convert Your Theme
            </h2>
          </div>

          {/* Two-column grid (desktop) */}
          <div className="grid gap-6" style={{ gridTemplateColumns: result ? '1fr 1fr' : '1fr', maxWidth: result ? '100%' : 480, margin: '0 auto' }}>
            {/* Left: Upload */}
            <div>
              <UploadZone onFileSelected={handleFileSelected} error={null} />

              {/* Error from conversion */}
              {error && (
                <div
                  className="mt-3 rounded-lg px-4 py-3 text-sm"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                >
                  {error}
                </div>
              )}

              {/* Convert button — only visible when file selected */}
              {hasFile && !isLoading && (
                <ConvertButton onClick={handleConvert} disabled={!fileContent} fileName={fileName} />
              )}

              {/* Loading state */}
              {isLoading && <LoadingState />}
            </div>

            {/* Right: Result panel */}
            {result && !isLoading && (
              <div>
                <ResultPanel xml={result} fileName={fileName} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Process</p>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: 32, color: '#f1f0ff', letterSpacing: '-0.02em' }}
            >
              How It Works
            </h2>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Desktop connector line */}
            <div
              className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2"
              style={{
                height: 2,
                background: 'none',
                borderTop: '2px dashed rgba(124,58,237,0.35)',
                zIndex: 0,
              }}
            />

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {[
                {
                  step: '01',
                  icon: (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.87 11.095H6.75z" />
                    </svg>
                  ),
                  iconColor: '#7c3aed',
                  title: 'Upload Your Theme',
                  text: 'Drop any HTML, CSS, XML or JSON theme file. Supports AI-generated themes too.',
                },
                {
                  step: '02',
                  icon: (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#06b6d4" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                    </svg>
                  ),
                  iconColor: '#06b6d4',
                  title: 'Gemini Converts It',
                  text: 'Gemini 2.0 Flash analyzes your theme and rebuilds it as a valid Blogger v2 XML.',
                },
                {
                  step: '03',
                  icon: (
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#7c3aed" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  ),
                  iconColor: '#7c3aed',
                  title: 'Upload to Blogger',
                  text: 'Download the .xml file and go to Blogger → Theme → Edit HTML → Upload.',
                },
              ].map((s, i) => (
                <div key={i} className="glass-card p-7 text-center">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                    style={{
                      background: `rgba(${s.iconColor === '#7c3aed' ? '124,58,237' : '6,182,212'},0.1)`,
                      border: `1px solid rgba(${s.iconColor === '#7c3aed' ? '124,58,237' : '6,182,212'},0.3)`,
                    }}
                  >
                    {s.icon}
                  </div>
                  <span
                    className="font-mono text-xs font-medium mb-2 block"
                    style={{ color: '#4a4a6a', letterSpacing: '0.05em' }}
                  >
                    Step {s.step}
                  </span>
                  <h3 className="font-display font-semibold mb-2" style={{ fontSize: 17, color: '#f1f0ff' }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8b8ba8' }}>
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUPPORTED FORMATS ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Compatibility</p>
            <h2
              className="font-display font-semibold"
              style={{ fontSize: 32, color: '#f1f0ff', letterSpacing: '-0.02em' }}
            >
              Supported Formats
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { ext: '.HTML', label: 'Complete theme pages', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
              { ext: '.CSS', label: 'Stylesheet files', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
              { ext: '.XML', label: 'Generic or AI-generated XML', color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
              { ext: '.JSON', label: 'Theme config files', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
            ].map((f) => (
              <div
                key={f.ext}
                className="glass-card p-6 text-center"
                style={{ background: f.bg }}
              >
                {/* File icon */}
                <div className="mx-auto mb-3 relative w-10 h-12">
                  <svg viewBox="0 0 40 48" fill="none" className="w-full h-full">
                    <rect width="40" height="48" rx="6" fill={`${f.color}20`} />
                    <path d="M26 2H8a4 4 0 00-4 4v36a4 4 0 004 4h24a4 4 0 004-4V16L26 2z" fill="none" stroke={f.color} strokeWidth="2" />
                    <path d="M26 2v14h14" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div
                  className="font-mono font-bold mb-1"
                  style={{ fontSize: 22, color: f.color, letterSpacing: '-0.02em' }}
                >
                  {f.ext}
                </div>
                <p className="text-xs leading-snug" style={{ color: '#8b8ba8' }}>{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="py-12 px-6 text-center"
        style={{ borderTop: '1px solid #1e1e35' }}
      >
        <div className="max-w-xl mx-auto space-y-3">
          <p className="font-display font-bold text-xl" style={{ color: '#f1f0ff' }}>
            XMLorph
          </p>
          <p className="text-sm" style={{ color: '#8b8ba8' }}>
            Built for Blogger creators
          </p>
          <div className="flex items-center justify-center gap-2">
            <span
              className="pill-badge text-xs"
              style={{ fontSize: 11, padding: '4px 12px' }}
            >
              ⚡ Powered by Gemini 2.0 Flash
            </span>
          </div>
          <p className="text-xs" style={{ color: '#4a4a6a' }}>
            © {new Date().getFullYear()} XMLorph — Free to use
          </p>
        </div>
      </footer>

    </main>
  )
}
