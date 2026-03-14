# 🎯 AI Job Match

> Score your resume against any job description in seconds. Powered by Claude AI.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Claude AI](https://img.shields.io/badge/Claude-AI-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**[Live Demo](https://your-demo-link.vercel.app)** · [Report Bug](https://github.com/yourusername/ai-job-match/issues)

---

## ✨ Features

- **Match Score** — Overall 0–100 score with per-section breakdown (skills, experience, education, keywords)
- **Keyword Analysis** — Matched vs missing keywords from the job description
- **Gap Detection** — Specific skills or experience you're missing
- **Bullet Rewriter** — Your existing resume bullets, rewritten to target this exact role
- **Cover Letter Generator** — One-click personalized cover letter tailored to the JD
- **PDF Upload** — Drag & drop PDF resume or paste plain text

---

## 🖥️ Demo

```
Upload resume → Paste JD → Get match score + rewritten bullets + cover letter
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI | Claude claude-opus-4-5 via Anthropic SDK |
| PDF Parsing | pdf-parse |
| Styling | CSS variables + Tailwind |
| Fonts | Syne (display) + DM Sans (body) |
| Deployment | Vercel |

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/ai-job-match.git
cd ai-job-match
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at [console.anthropic.com](https://console.anthropic.com)

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
ai-job-match/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts        # Main analysis endpoint
│   │   │   └── cover-letter/
│   │   │       └── route.ts        # Cover letter generation
│   │   ├── globals.css             # Design tokens + animations
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Main UI (upload form)
│   ├── components/
│   │   ├── Results.tsx             # Analysis results display
│   │   └── ScoreRing.tsx           # Animated SVG score ring
│   └── lib/
│       ├── claude.ts               # Anthropic API calls
│       └── pdf.ts                  # PDF text extraction
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🧠 How It Works

```
User uploads resume + pastes JD
        ↓
/api/analyze extracts text from PDF (if needed)
        ↓
Claude analyzes resume vs JD → returns structured JSON:
  - overallScore (0-100)
  - strengths, gaps
  - matched/missing keywords
  - improved bullet points
  - per-section scores
        ↓
Results page renders score ring + keyword pills + bullet diffs
        ↓
Optional: /api/cover-letter generates a personalized letter
```

---

## 🌐 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set the `ANTHROPIC_API_KEY` environment variable in your Vercel project dashboard.

---

## 💡 Extend It

Ideas to level this up further:

- [ ] Save analysis history (Supabase or PlanetScale)
- [ ] Multi-resume comparison for the same JD
- [ ] ATS score simulation (check formatting issues)
- [ ] LinkedIn profile import via URL
- [ ] Export improved resume as PDF
- [ ] Job board integration (scrape JDs from URL)

---

## 📄 License

MIT — use it, fork it, ship it.

---

## 🙏 Built With

- [Anthropic Claude API](https://www.anthropic.com)
- [Next.js](https://nextjs.org)
- [Vercel](https://vercel.com)
