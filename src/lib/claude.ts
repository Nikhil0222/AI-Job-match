import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function analyzeJobMatch(resumeText: string, jobDescription: string) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `You are an expert career coach and ATS optimization specialist. Analyze how well this resume matches the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Respond with ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "keywords": {
    "matched": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
    "missing": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]
  },
  "improvedBullets": [
    { "original": "<original bullet from resume>", "improved": "<rewritten bullet tailored to this JD>" },
    { "original": "<original bullet from resume>", "improved": "<rewritten bullet tailored to this JD>" },
    { "original": "<original bullet from resume>", "improved": "<rewritten bullet tailored to this JD>" }
  ],
  "sectionScores": {
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "keywords": <number 0-100>
  }
}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  return JSON.parse(content.text)
}

export async function generateCoverLetter(resumeText: string, jobDescription: string, companyName: string) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `You are an expert career coach. Write a compelling, personalized cover letter based on this resume and job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

COMPANY NAME: ${companyName}

Write a professional cover letter that:
- Opens with a strong hook specific to this role
- Highlights 2-3 most relevant experiences from the resume
- Shows genuine enthusiasm for the company/role
- Closes with a clear call to action
- Is 3-4 paragraphs, around 300 words
- Sounds human and authentic, not robotic

Return ONLY the cover letter text, no extra commentary.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  return content.text
}
