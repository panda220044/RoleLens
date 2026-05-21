# 🔍 RoleLens

**RoleLens** is an AI-powered resume analysis platform that helps both job seekers and recruiters make smarter decisions — faster.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-role--lens.vercel.app-black?style=for-the-badge&logo=vercel)](https://role-lens.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-blue?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🌐 Live Demo

> 🚀 **[https://role-lens.vercel.app](https://role-lens.vercel.app)**

No setup needed — open the link and start analyzing resumes instantly.

---

## ✨ Features

### 🎓 Student Portal
- Upload your resume PDF and paste a job description
- Get an instant **AI-generated match score** (0–100%)
- See **matched skills**, **missing skills**, and **actionable feedback**
- Receive a personalized **action plan** to improve your chances
- Smart **semantic skill mapping** — understands acronyms, synonyms & implied skills

### 🏢 Recruiter Portal
- Upload **multiple candidate resumes** at once (drag & drop)
- Batch analyze all candidates against a single job description
- View an **auto-ranked leaderboard** sorted by match score
- Click any candidate to see their full detailed breakdown

---

## 📸 Screenshots

### Landing Page — Portal Selection
<!-- Add screenshot here: landing page showing Student & Recruiter portals -->
> *Screenshot coming soon*

### 🎓 Student Portal — Resume Upload
<!-- Add screenshot here: student portal with PDF upload and job description -->
> *Screenshot coming soon*

### 🎓 Student Portal — Analysis Results
<!-- Add screenshot here: results view showing score, matched/missing skills, action plan -->
> *Screenshot coming soon*

### 🏢 Recruiter Portal — Candidate Upload
<!-- Add screenshot here: recruiter drag & drop upload area with multiple resumes -->
> *Screenshot coming soon*

### 🏢 Recruiter Portal — Ranked Leaderboard
<!-- Add screenshot here: ranked leaderboard showing all candidates with scores -->
> *Screenshot coming soon*

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| PDF Parsing | `pdf2json` |
| Animations | Framer Motion |
| Icons | Lucide React |
| Styling | Vanilla CSS + Glassmorphism |
| Deployment | Vercel |

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/panda220044/RoleLens.git
cd RoleLens
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy Your Own

Deploy instantly to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/panda220044/RoleLens&env=GEMINI_API_KEY&envDescription=Your%20Google%20Gemini%20API%20Key&envLink=https://aistudio.google.com/apikey)

Then add your `GEMINI_API_KEY` in the Vercel project settings under **Environment Variables**.

---

## 📁 Project Structure

```
RoleLens/
├── app/
│   ├── api/
│   │   ├── analyze/        # Gemini AI resume analysis endpoint
│   │   └── parse-pdf/      # PDF text extraction endpoint
│   ├── components/
│   │   └── ResultsView.js  # Shared results display component
│   ├── recruiter/          # Recruiter portal page
│   ├── student/            # Student portal page
│   ├── globals.css         # Global styles & design tokens
│   ├── layout.js
│   └── page.js             # Landing / portal selection page
├── .env.example
└── next.config.mjs
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key (required) |

Copy `.env.example` to `.env.local` and fill in your key.

---

## 📄 License

MIT — feel free to use, fork, and build on top of this project.
