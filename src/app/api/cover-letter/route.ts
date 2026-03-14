import { NextRequest, NextResponse } from 'next/server'
import { generateCoverLetter } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, companyName } = await request.json()

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Resume and job description are required' }, { status: 400 })
    }

    const coverLetter = await generateCoverLetter(
      resumeText,
      jobDescription,
      companyName || 'the company'
    )

    return NextResponse.json({ success: true, coverLetter })
  } catch (error) {
    console.error('Cover letter error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cover letter generation failed' },
      { status: 500 }
    )
  }
}
