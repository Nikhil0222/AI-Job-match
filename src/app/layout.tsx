import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Job Match — Resume Analyzer',
  description: 'Instantly score your resume against any job description. Get AI-powered gap analysis, keyword matching, and tailored bullet points.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
