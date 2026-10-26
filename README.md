# 🧪 English Lab

> **A modern, interactive personal vocabulary laboratory designed for mastering English vocabulary through active recall, ghost-letter overlay typing, and dynamic quizzes.**

Built with **Next.js 15 (React 19 / Node.js)** following **Clean Architecture**, styled with **Tailwind CSS (CDN)** in a sleek **Dark Blue Glassmorphism** aesthetic, and deployed serverlessly on **Vercel**. Vocabulary data is versioned and stored directly in your GitHub repository as [`data/words.json`](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/data/words.json).

---

## 🎯 Key Features

- ♾️ **Endless Practice Mode:** No rigid question caps or stressful timers. Practice continuously as long as you want; questions cycle and reshuffle automatically until you choose to finish.
- 🔤 **Ghost-Letter Overlay Typing:** Prompt on the left, faint semi-transparent watermark letters on the right. Type directly over the faint target letters using your physical keyboard or the on-screen keypad to develop spelling muscle memory.
- 🎮 **Dual Learning Modes:**
  1. **Type Over Ghost (Letter Box):** Active recall and precision spelling with instant letter-by-letter visual and acoustic feedback.
  2. **Multiple Choice (Quiz):** Fast 4-option quizzes with desktop hotkeys (`[1]`, `[2]`, `[3]`, `[4]`).
- 🔄 **Bilingual Direction:**
  - `Uzbek ➡️ English` (Recall English terms from Uzbek meanings)
  - `English ➡️ Uzbek` (Recognize Uzbek translations from English prompts)
- 📊 **CEFR Proficiency Levels:** Structured across **A1, A2, B1, B2, C1, and C2** levels with single words, example sentences, and grammatical tags.
- 🎨 **Dark Blue Glassmorphism:** Deep navy backgrounds (`#020617`, `#030a1c`), translucent blurred cards (`backdrop-blur-md`), ambient cyan/indigo glows, and responsive layout across mobile and desktop.
- 🔊 **Zero-Latency Audio Synthesis:** Native Web Audio API sound effects for correct and incorrect answers without downloading heavy external MP3 files.
- 📈 **Results & Mistakes Review:** Full accuracy score breakdown, streak counter, and a dedicated **"Retry Mistakes"** flow to review and master missed terms.

---

## 📚 Comprehensive Documentation

Detailed technical specifications and architectural documentation are available in the [`documents/`](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents) directory:

1. [01_overview.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/01_overview.md) — Project vision, objectives, and feature requirements.
2. [02_architecture.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/02_architecture.md) — Clean Architecture breakdown, Next.js App Router, Tailwind CDN, and Vercel.
3. [03_data_structure.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/03_data_structure.md) — Hierarchical CEFR JSON schema, single words, and sentence models.
4. [04_game_modes_and_logic.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/04_game_modes_and_logic.md) — Endless loop engine, ghost typing mechanics, and validation algorithms.
5. [05_ui_ux_flow.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/05_ui_ux_flow.md) — Screen flows, responsive split layout, and accessibility shortcuts.
6. [06_roadmap.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/06_roadmap.md) — Development phases, testing guidelines, and Vercel deployment.

---

## 📂 Project Structure

```text
english-lab/
├── .gitignore               # Git exclusions (node_modules, .next, environment files)
├── README.md                # Project introduction and quickstart
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # TypeScript configuration with @/* alias
├── data/
│   ├── words.json           # 5,300+ CEFR (A1-C2) words with Uzbek translations
│   └── sources/             # Oxford 3000/5000 & Langeek PDFs, datasets & cache
├── scripts/
│   └── import_vocabulary.py # Automated extraction, translation & merge pipeline
├── documents/               # Technical documentation
└── src/
    ├── core/                # Clean Architecture: Entities & Domain Models
    ├── application/         # Use Cases & Repository Interfaces
    ├── infrastructure/      # File System loader, GitHub API, Web Audio synthesizer
    ├── presentation/        # React components (Dashboard, ActiveSession, Results)
    └── app/                 # Next.js App Router (Layout, API Routes, Global Styles)
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🔗 GitHub Repository

- Repository URL: [https://github.com/muzaffarbekmustafayev/english-lab.git](https://github.com/muzaffarbekmustafayev/english-lab.git)
