'use client'

import { useState, useRef, useCallback } from 'react'
import { Results } from '@/components/Results'

type Step = 'input' | 'loading' | 'results'

export default function Home() {
  const [step, setStep] = useState<Step>('input')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeMode, setResumeMode] = useState<'text' | 'file'>('text')
  const [dragOver, setDragOver] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [finalResumeText, setFinalResumeText] = useState('')
  const [error, setError] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadingMessages = [
    'Reading your resume...',
    'Scanning job requirements...',
    'Matching skills and keywords...',
    'Scoring your fit...',
    'Rewriting bullet points...',
    'Finalizing insights...',
  ]

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf' || file.type === 'text/plain') {
      setResumeFile(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) { setError('Please paste a job description.'); return }
    if (resumeMode === 'text' && !resumeText.trim()) { setError('Please paste your resume text.'); return }
    if (resumeMode === 'file' && !resumeFile) { setError('Please upload your resume.'); return }
    setError('')
    setStep('loading')

    let msgIdx = 0
    setLoadingMsg(loadingMessages[0])
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length
      setLoadingMsg(loadingMessages[msgIdx])
    }, 1800)

    try {
      const formData = new FormData()
      formData.append('jobDescription', jobDescription)
      if (resumeMode === 'file' && resumeFile) {
        formData.append('resume', resumeFile)
      } else {
        formData.append('resumeText', resumeText)
      }

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()

      clearInterval(interval)

      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong')
        setStep('input')
        return
      }

      setAnalysis(data.analysis)
      setFinalResumeText(data.resumeText)
      setStep('results')
    } catch (e) {
      clearInterval(interval)
      setError('Network error. Please try again.')
      setStep('input')
    }
  }

  if (step === 'results' && analysis) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
        <Results
          analysis={analysis}
          resumeText={finalResumeText}
          jobDescription={jobDescription}
          onReset={() => { setStep('input'); setAnalysis(null) }}
        />
      </div>
    )
  }

  if (step === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}>
        {/* Animated score ring placeholder */}
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
            <circle cx="60" cy="60" r="52" fill="none"
              stroke="var(--c-accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="326"
              strokeDashoffset="326"
              style={{ animation: 'scoreLoad 2s ease infinite' }}
            />
          </svg>
          <style>{`
            @keyframes scoreLoad {
              0% { stroke-dashoffset: 326; }
              50% { stroke-dashoffset: 80; }
              100% { stroke-dashoffset: 326; }
            }
          `}</style>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
            Analyzing your match
          </p>
          <p style={{ color: 'var(--c-muted)', fontSize: 14, transition: 'opacity 0.3s' }}>{loadingMsg}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
      {/* Subtle grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '3rem 1rem' }}>

        {/* Hero */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--c-accent-glow)', border: '0.5px solid rgba(124,111,255,0.3)',
            borderRadius: 20, padding: '4px 12px', marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-accent)', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: 'var(--c-accent)', fontFamily: 'var(--font-mono)' }}>AI-Powered Resume Analyzer</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 60px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            marginBottom: 16,
          }}>
            Score your resume<br />
            <span style={{ color: 'var(--c-accent)' }}>before they do</span>
          </h1>
          <p style={{ color: 'var(--c-muted)', fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Paste a job description, upload your resume, and get an instant AI analysis with your match score, gaps, and rewritten bullet points.
          </p>
        </div>

        {/* Form card */}
        <div className="fade-up" style={{
          background: 'var(--c-surface)',
          border: '0.5px solid var(--c-border)',
          borderRadius: 20,
          overflow: 'hidden',
        }}>

          {/* Job Description */}
          <div style={{ padding: '1.5rem', borderBottom: '0.5px solid var(--c-border)' }}>
            <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--c-muted)', marginBottom: 10, letterSpacing: '0.06em' }}>
              01 / JOB DESCRIPTION
            </label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              style={{
                width: '100%', padding: '12px 14px',
                background: 'var(--c-bg)',
                border: '0.5px solid var(--c-border)',
                borderRadius: 10,
                color: 'var(--c-text)',
                fontSize: 14,
                fontFamily: 'var(--font-body)',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          {/* Resume */}
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--c-muted)', letterSpacing: '0.06em' }}>
                02 / YOUR RESUME
              </label>
              {/* Toggle */}
              <div style={{ display: 'flex', gap: 4, background: 'var(--c-bg)', borderRadius: 8, padding: 3, border: '0.5px solid var(--c-border)' }}>
                {(['text', 'file'] as const).map(mode => (
                  <button key={mode} onClick={() => setResumeMode(mode)} style={{
                    padding: '4px 12px', borderRadius: 5, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontFamily: 'var(--font-body)',
                    background: resumeMode === mode ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: resumeMode === mode ? 'var(--c-text)' : 'var(--c-muted)',
                  }}>
                    {mode === 'text' ? 'Paste text' : 'Upload PDF'}
                  </button>
                ))}
              </div>
            </div>

            {resumeMode === 'text' ? (
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                rows={8}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'var(--c-bg)',
                  border: '0.5px solid var(--c-border)',
                  borderRadius: 10,
                  color: 'var(--c-text)',
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `1.5px dashed ${dragOver ? 'var(--c-accent)' : resumeFile ? 'var(--c-green)' : 'var(--c-border-strong)'}`,
                  borderRadius: 10,
                  padding: '2.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? 'var(--c-accent-glow)' : resumeFile ? 'var(--c-green-glow)' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {resumeFile ? (
                  <>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
                    <p style={{ color: 'var(--c-green)', fontSize: 14, margin: 0 }}>{resumeFile.name}</p>
                    <p style={{ color: 'var(--c-muted)', fontSize: 12, marginTop: 4 }}>Click to replace</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>📄</div>
                    <p style={{ color: 'var(--c-muted)', fontSize: 14, margin: 0 }}>Drag & drop your resume here</p>
                    <p style={{ color: 'rgba(240,240,245,0.25)', fontSize: 12, marginTop: 6 }}>PDF or TXT · Click to browse</p>
                  </>
                )}
              </div>
            )}

            {error && (
              <p style={{ color: 'var(--c-red)', fontSize: 13, marginTop: 12 }}>{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleAnalyze}
              style={{
                width: '100%',
                marginTop: '1.25rem',
                padding: '14px',
                background: 'var(--c-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.3px',
                cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.1s',
                boxShadow: '0 0 32px var(--c-accent-glow)',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.99)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Analyze Match →
            </button>
          </div>
        </div>

        {/* Footer chips */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          {['Match Score', 'Keyword Analysis', 'Gap Detection', 'Bullet Rewrites', 'Cover Letter'].map(f => (
            <span key={f} style={{
              fontSize: 12, padding: '4px 12px', borderRadius: 20,
              border: '0.5px solid var(--c-border)', color: 'var(--c-muted)',
            }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
