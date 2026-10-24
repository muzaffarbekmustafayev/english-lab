# English Lab — Technical Documentation

**English Lab** is a personalized, self-hosted web application engineered to accelerate English vocabulary acquisition through active recall, spelling over ghost watermarks, and multiple-choice quizzes. Built with **Next.js (React / Node.js)** adhering to **Clean Architecture**, styled via **Tailwind CSS (CDN)** in a high-contrast **Dark Blue Glassmorphism** theme, and deployed to **Vercel**.

This `documents/` folder contains the end-to-end technical specifications, architectural designs, data schemas, game mechanics, and implementation roadmaps.

---

## 📑 Table of Contents

| File | Document | Purpose & Summary |
| :--- | :--- | :--- |
| [01_overview.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/01_overview.md) | **Project Overview** | Core mission, key requirements, target audience, and primary differentiators |
| [02_architecture.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/02_architecture.md) | **Technical Architecture** | Clean Architecture layers, Next.js App Router, Tailwind CDN, and Vercel hosting |
| [03_data_structure.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/03_data_structure.md) | **Data Structure & JSON** | Hierarchical CEFR A1-C2 schema, single words, sentence tokens, and helpers |
| [04_game_modes_and_logic.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/04_game_modes_and_logic.md) | **Game Modes & Core Logic** | Endless practice loop, ghost watermark typing mechanics, and bilingual directions |
| [05_ui_ux_flow.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/05_ui_ux_flow.md) | **UI/UX Design & User Flow** | Dark blue glassmorphism, responsive split layout, and keyboard shortcuts |
| [06_roadmap.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/06_roadmap.md) | **Implementation Roadmap** | Step-by-step milestones, validation checklist, and CI/CD setup |

---

## ⚡ Architecture at a Glance

```text
Domain Entities  ──▶  Application Use Cases  ──▶  Infrastructure (FS & GitHub)
       │                        │                               │
       └────────────────────────┴───────────────────────────────┘
                                ▼
                       Presentation Layer
                 (React, Tailwind CDN & Glassmorphism)
```

- **Database:** Serverless JSON file stored at `data/words.json` in the Git repo.
- **Styling:** Native Tailwind CSS loaded via high-performance CDN script with custom dark blue glass tokens.
- **Hosting:** Vercel with automatic edge caching and fast builds.
