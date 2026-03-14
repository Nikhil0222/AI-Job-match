'use client'

interface ScoreRingProps {
  score: number
  size?: number
  label?: string
}

export function ScoreRing({ score, size = 160, label }: ScoreRingProps) {
  const radius = 76
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 75 ? 'var(--c-green)' :
    score >= 50 ? 'var(--c-amber)' :
    'var(--c-red)'

  const glowColor =
    score >= 75 ? 'var(--c-green-glow)' :
    score >= 50 ? 'rgba(255,203,71,0.2)' :
    'rgba(255,107,107,0.2)'

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        {/* Glow ring */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeOpacity="0.12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        {/* Main ring */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: size > 120 ? 38 : 22,
          fontWeight: 700,
          color,
          lineHeight: 1,
          textShadow: `0 0 24px ${glowColor}`,
        }}>{score}</span>
        {label && (
          <span style={{ fontSize: 10, color: 'var(--c-muted)', fontFamily: 'var(--font-body)', textAlign: 'center', maxWidth: 70 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
