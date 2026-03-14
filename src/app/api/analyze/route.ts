import { NextRequest, NextResponse } from 'next/server'
import { analyzeJobMatch } from '@/lib/claude'
import { extractTextFromPDF, cleanResumeText } from '@/lib/pdf'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get('resume') as File | null
    const jobDescription = formData.get('jobDescription') as string
    const resumeText = formData.get('resumeText') as string

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 })
    }

    let finalResumeText = ''

    if (resumeFile && resumeFile.size > 0) {
      const bytes = await resumeFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      if (resumeFile.type === 'application/pdf') {
        finalResumeText = await extractTextFromPDF(buffer)
      } else {
        finalResumeText = buffer.toString('utf-8')
      }
    } else if (resumeText) {
      finalResumeText = resumeText
    } else {
      return NextResponse.json({ error: 'Resume is required (file or text)' }, { status: 400 })
    }

    finalResumeText = cleanResumeText(finalResumeText)

    if (finalResumeText.length < 100) {
      return NextResponse.json({ error: 'Resume text is too short. Please provide a complete resume.' }, { status: 400 })
    }

    const analysis = await analyzeJobMatch(finalResumeText, jobDescription)

    return NextResponse.json({ success: true, analysis, resumeText: finalResumeText })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
