'use client'

import { useState } from 'react'
import { ScoreRing } from './ScoreRing'

interface Analysis {
  overallScore: number
  summary: string
  strengths: string[]
  gaps: string[]
  keywords: { matched: string[]; missing: string[] }
  improvedBullets: { original: string; improved: string }[]
  sectionScores: { skills: number; experience: number; education: number; keywords: number }
}

interface ResultsProps {
  analysis: Analysis
  resumeText: string
  jobDescription: string
  onReset: () => void
}

export function Results({ analysis, resumeText, jobDescription, onReset }: ResultsProps) {
  const [coverLetter, setCoverLetter] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loadingCL, setLoadingCL] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'bullets' | 'cover'>('overview')
  const [copied, setCopied] = useState(false)

  const scoreColor = (s: number) =>
    s >= 75 ? 'var(--c-green)' : s >= 50 ? 'var(--c-amber)' : 'var(--c-red)'

  const handleCoverLetter = async () => {
    setLoadingCL(true)
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription, companyName }),
      })
      const data = await res.json()
      if (data.coverLetter) setCoverLetter(data.coverLetter)
    } finally {
      setLoadingCL(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'bullets', label: 'Improved Bullets' },
    { id: 'cover', label: 'Cover Letter' },
  ] as const

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            Match Analysis
          </h1>
          <p style={{ color: 'var(--c-muted)', margin: '4px 0 0', fontSize: 14 }}>
            Here's how your resume stacks up
          </p>
        </div>
        <button onClick={onReset} style={{
          background: 'transparent',
          border: '0.5px solid var(--c-border-strong)',
          color: 'var(--c-muted)',
          padding: '8px 16px',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 13,
          fontFamily: 'var(--font-body)',
        }}>
          ← New Analysis
        </button>
      </div>

      {/* Score hero */}
      <div className="fade-up" style={{
        background: 'var(--c-surface)',
        border: '0.5px solid var(--c-border)',
        borderRadius: 16,
        padding: '2rem',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <ScoreRing score={analysis.overallScore} size={160} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: scoreColor(analysis.overallScore),
            }}>
              {analysis.overallScore >= 75 ? 'Strong Match' : analysis.overallScore >= 50 ? 'Partial Match' : 'Low Match'}
            </span>
          </div>
          <p style={{ color: 'var(--c-muted)', fontSize: 15, lineHeight: 1.7, margin: '0 0 1.5rem' }}>
            {analysis.summary}
          </p>
          {/* Section scores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {Object.entries(analysis.sectionScores).map(([key, val]) => (
              <div key={key}>
                <div style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 6, textTransform: 'capitalize' }}>{key}</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${val}%`,
                    background: scoreColor(val),
                    borderRadius: 2,
                    transition: 'width 1s ease',
                    boxShadow: `0 0 8px ${scoreColor(val)}`,
                  }} />
                </div>
                <div style={{ fontSize: 12, color: scoreColor(val), marginTop: 4, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: 'var(--c-surface)', padding: 4, borderRadius: 10, border: '0.5px solid var(--c-border)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: 7,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            fontWeight: activeTab === tab.id ? 500 : 400,
            background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: activeTab === tab.id ? 'var(--c-text)' : 'var(--c-muted)',
            transition: 'all 0.2s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Strengths */}
          <div style={{ background: 'var(--c-surface)', border: '0.5px solid var(--c-border)', borderRadius: 12, padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--c-green)', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ✦ Strengths
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {analysis.strengths.map((s, i) => (
                <li key={i} style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.5, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--c-green)', fontSize: 10 }}>▸</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Gaps */}
          <div style={{ background: 'var(--c-surface)', border: '0.5px solid var(--c-border)', borderRadius: 12, padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--c-red)', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ✦ Gaps
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {analysis.gaps.map((g, i) => (
                <li key={i} style={{ fontSize: 14, color: 'var(--c-muted)', lineHeight: 1.5, paddingLeft: 16, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--c-red)', fontSize: 10 }}>▸</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>

          {/* Keywords matched */}
          <div style={{ background: 'var(--c-surface)', border: '0.5px solid var(--c-border)', borderRadius: 12, padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--c-muted)', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Keywords Matched
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {analysis.keywords.matched.map((k, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 20,
                  background: 'var(--c-green-glow)', color: 'var(--c-green)',
                  border: '0.5px solid rgba(79,255,176,0.2)',
                }}>{k}</span>
              ))}
            </div>
          </div>

          {/* Keywords missing */}
          <div style={{ background: 'var(--c-surface)', border: '0.5px solid var(--c-border)', borderRadius: 12, padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--c-muted)', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Keywords Missing
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {analysis.keywords.missing.map((k, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 20,
                  background: 'rgba(255,107,107,0.08)', color: 'var(--c-red)',
                  border: '0.5px solid rgba(255,107,107,0.2)',
                }}>{k}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Bullets */}
      {activeTab === 'bullets' && (
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--c-muted)', fontSize: 14, marginBottom: 4 }}>
            These bullet points from your resume have been rewritten to better match this specific job description.
          </p>
          {analysis.improvedBullets.map((b, i) => (
            <div key={i} style={{ background: 'var(--c-surface)', border: '0.5px solid var(--c-border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '0.5px solid var(--c-border)' }}>
                <div style={{ fontSize: 11, color: 'var(--c-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>ORIGINAL</div>
                <p style={{ fontSize: 14, color: 'rgba(240,240,245,0.5)', margin: 0, lineHeight: 1.6, textDecoration: 'line-through', textDecorationColor: 'rgba(255,107,107,0.4)' }}>
                  {b.original}
                </p>
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: 11, color: 'var(--c-green)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>IMPROVED</div>
                <p style={{ fontSize: 14, color: 'var(--c-text)', margin: 0, lineHeight: 1.6 }}>
                  {b.improved}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Cover Letter */}
      {activeTab === 'cover' && (
        <div className="fade-up">
          {!coverLetter ? (
            <div style={{ background: 'var(--c-surface)', border: '0.5px solid var(--c-border)', borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✉️</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                Generate Cover Letter
              </h3>
              <p style={{ color: 'var(--c-muted)', fontSize: 14, marginBottom: 20 }}>
                A personalized cover letter tailored to this job description
              </p>
              <div style={{ maxWidth: 320, margin: '0 auto 16px' }}>
                <input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Company name (optional)"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'var(--c-bg)',
                    border: '0.5px solid var(--c-border-strong)',
                    borderRadius: 8,
                    color: 'var(--c-text)',
                    fontSize: 14,
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                  }}
                />
              </div>
              <button onClick={handleCoverLetter} disabled={loadingCL} style={{
                background: 'var(--c-accent)',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                cursor: loadingCL ? 'not-allowed' : 'pointer',
                opacity: loadingCL ? 0.7 : 1,
              }}>
                {loadingCL ? 'Generating...' : 'Generate Cover Letter'}
              </button>
            </div>
          ) : (
            <div style={{ background: 'var(--c-surface)', border: '0.5px solid var(--c-border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--c-muted)' }}>Cover Letter</span>
                <button onClick={() => copyToClipboard(coverLetter)} style={{
                  fontSize: 12, padding: '5px 12px', borderRadius: 6, border: '0.5px solid var(--c-border-strong)',
                  background: 'transparent', color: copied ? 'var(--c-green)' : 'var(--c-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ padding: '1.5rem', whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: 'var(--c-muted)' }}>
                {coverLetter}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
