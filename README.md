# 🔍 RoleLens

**RoleLens** is an AI-powered resume analysis platform that helps both job seekers and recruiters make smarter decisions — faster.

<img width="1883" height="890" alt="Screenshot 2026-04-29 102432" src="https://github.com/user-attachments/assets/1a8851e7-15da-43e1-a364-0f030543c000" />
<img width="1851" height="887" alt="Screenshot 2026-04-29 104857" src="https://github.com/user-attachments/assets/16f933a6-291a-49c7-97ec-3a0f12a3535e" />
<img width="1825" height="890" alt="Screenshot 2026-04-29 104749" src="https://github.com/user-attachments/assets/dd7b387e-8f8f-47b0-841a-829593ae96bb" />
<img width="1855" height="760" alt="Screenshot 2026-04-29 104759" src="https://github.com/user-attachments/assets/9cb9ee0d-4ffc-43f2-bcb1-b65a40986024" />
<img width="1839" height="843" alt="Screenshot 2026-04-29 104807" src="https://github.com/user-attachments/assets/fb397d80-073d-4aaf-9dbd-929e5d839e3d" />
<img width="1832" height="542" alt="Screenshot 2026-04-29 104816" src="https://github.com/user-attachments/assets/31a1ef7d-dcc8-4a55-ad38-bf1363ce9863" />








---

## ✨ Features

### 🎓 Student Portal
- Upload your resume PDF and paste a job description
- Get an instant **AI-generated match score** (0–100%)
- See **matched skills**, **missing skills**, and **actionable feedback**
- Receive a personalized **action plan** to improve your chances

### 🏢 Recruiter Portal
- Upload **multiple candidate resumes** at once (drag & drop)
- Batch analyze all candidates against a single job description
- View an **auto-ranked leaderboard** sorted by match score
- Click any candidate to see their full detailed report

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

---

## 🚀 Getting Started

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
