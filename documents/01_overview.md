# 01. Project Overview

## 1. Introduction and Objectives

**English Lab** is an interactive, lightweight web application built for individuals who want an efficient, personalized environment to build and retain English vocabulary.

Traditional language learning apps (such as Duolingo, Memrise, or Anki) often rely on pre-packaged word lists that do not match the user's immediate everyday reading, technical career, or personal interests. **English Lab** solves this by putting the user in complete control:
- The user curates and updates their own vocabulary database directly inside a **GitHub repository** (`data/words.json`).
- The web app reads this database and constructs randomized, distraction-free active recall exercises.

---

## 2. Core Features and Requirements

1. **Self-Managed Vocabulary Database:**
   - Single words, phrases, and illustrative sentences stored in `data/words.json`.
   - Categorized by **CEFR proficiency levels** (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`).
   - Managed directly through Git commits or the GitHub web editor without requiring external databases.

2. **Endless Practice Mode:**
   - Practice is unconstrained by question caps.
   - Questions cycle continuously through randomized shuffling until the user elects to conclude their session.
   - Elimination of stressful timers allows for relaxed, deep memorization.

3. **Bilingual Practice Directions:**
   - **Uzbek ➡️ English (UZ ➡️ EN):** See the Uzbek meaning on the left, type or select the English translation on the right.
   - **English ➡️ Uzbek (EN ➡️ UZ):** See the English word on the left, identify the Uzbek definition on the right.

4. **Dual Interactive Exercise Modes:**
   - **Mode A: Type Over Ghost Watermark (Letter Box):**
     - Target word letters are visible as subtle, faint ghost watermarks.
     - As the user types on their keyboard or taps on-screen keys, vibrant letters render directly over the faint guides.
     - Provides instant visual (emerald pop / rose shake) and acoustic feedback.
   - **Mode B: Multiple Choice (Quiz):**
     - 4 interactive options (1 correct answer + 3 dynamically chosen distractors).
     - Full desktop hotkey support (`[1]`, `[2]`, `[3]`, `[4]`).

5. **Clean Architecture & Technology Stack:**
   - **Framework:** Next.js 15 (React 19 / Node.js) with App Router.
   - **Styling:** Tailwind CSS loaded via CDN, combined with custom Dark Blue Glassmorphism styling tokens.
   - **Audio:** Zero-latency procedural sound synthesis with the browser's Web Audio API.
   - **Hosting:** Vercel serverless deployment with automatic edge caching.

---

## 3. Key Advantages

- ⚡ **Zero Backend Overhead:** No complex SQL/NoSQL databases or external container setups.
- 🔒 **Git Version Control:** Every word added or edited is permanently tracked in Git history.
- 📱 **Fully Responsive:** Fluid layout that transitions from a 2-column desktop split screen to a touch-optimized mobile experience.
- 🧠 **Superior Active Recall:** Typing directly over faint guides activates motor memory and spelling precision far beyond passive multiple-choice guessing.
