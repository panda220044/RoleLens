<img width="1880" height="859" alt="Screenshot 2026-05-21 232647" src="https://github.com/user-attachments/assets/f7177378-d263-4562-a403-1980e234b299" />
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
<img width="1891" height="832" alt="Screenshot 2026-05-21 233530" src="https://github.com/user-attachments/assets/6303c5ee-738a-44a4-b677-3931d7776f40" />

<img width="1880" height="859" alt="Screenshot 2026-05-21 232647" src="https://github.com/user-attachments/assets/9569643a-765d-4605-9e63-2536b7a312a4" />

<img width="1252" height="832" alt="Screenshot 2026-05-21 232748" src="https://github.com/user-attachments/assets/cef3736b-21d5-4e92-ac75-64fbb4d41fec" />
<img width="1833" height="728" alt="Screenshot 2026-05-21 232850" src="https://github.com/user-attachments/assets/038767fe-a678-4f29-a6f0-35bd8f05e564" />
<img width="1838" height="764" alt="Screenshot 2026-05-21 232859" src="https://github.com/user-attachments/assets/b51d2548-b6cd-42fb-b676-cda47b7bb09a" />
<img width="1863" height="541" alt="Screenshot 2026-05-21 232907" src="https://github.com/user-attachments/assets/bd96d933-659a-475d-845f-d9d4593a0ade" />
<img width="1869" height="829" alt="Screenshot 2026-05-21 233017" src="https://github.com/user-attachments/assets/655eaf4c-98ec-4f25-98a6-3783601060c0" />


<img width="1891" height="825" alt="Screenshot 2026-05-21 233105" src="https://github.com/user-attachments/assets/ae613c3b-a72e-4258-b911-58d6a235c34f" />










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
