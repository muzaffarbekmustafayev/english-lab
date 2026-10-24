# 03. Data Structure & JSON Schema

## 1. Overview

All vocabulary items, illustrative sentences, and level definitions are stored in a single JSON file: [`data/words.json`](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/data/words.json).

The database is organized into **CEFR Proficiency Levels** (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`). Within each level, entries are divided into two distinct collections:
1. **`words` (Single Words):** Precise individual vocabulary terms (e.g., `water` ➡️ `suv`, `brave` ➡️ `jasur`). Designed specifically for letter typing and single-term quizzes.
2. **`sentences` (Contextual Sentences):** Full idiomatic sentences demonstrating real-world usage (e.g., *"Where do you live?"* ➡️ *"Siz qayerda yashaysiz?"*).

---

## 2. TypeScript Data Schema

```typescript
export type CEFRLevel = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export interface ExampleSentence {
  en: string; // English example sentence
  uz: string; // Uzbek translation of the example
}

export interface WordItem {
  id: string;               // Unique identifier (e.g. "a1-w-001")
  en: string;               // English word (e.g. "brave")
  uz: string;               // Uzbek translation (e.g. "jasur")
  type?: "noun" | "verb" | "adjective" | "adverb"; // Part of speech
  synonyms?: string[];      // Array of synonyms
  examples?: ExampleSentence[]; // Contextual examples
  hint?: string;            // Clue or prompt hint
}

export interface SentenceItem {
  id: string;               // Unique identifier (e.g. "a1-s-001")
  en: string;               // English sentence
  uz: string;               // Uzbek translation
  focusWord?: string;       // Primary keyword being studied
  tokens?: string[];        // Tokenized array of individual words
}

export interface LevelGroup {
  level: CEFRLevel;         // "a1" | "a2" | "b1" | "b2" | "c1" | "c2"
  title: string;            // "Beginner", "Elementary", etc.
  description: string;      // Level overview
  words: WordItem[];        // Single-word list
  sentences: SentenceItem[];// Sentence list
}

export interface DatabaseSchema {
  levels: LevelGroup[];
}
```

---

## 3. Representative `data/words.json` Sample

```json
{
  "levels": [
    {
      "level": "a1",
      "title": "Beginner",
      "description": "Essential foundational everyday vocabulary and basic conversational sentences",
      "words": [
        {
          "id": "a1-w-001",
          "en": "water",
          "uz": "suv",
          "type": "noun",
          "synonyms": ["liquid"],
          "examples": [
            {
              "en": "I drink water every morning.",
              "uz": "Men har kuni ertalab suv ichaman."
            }
          ]
        }
      ],
      "sentences": [
        {
          "id": "a1-s-001",
          "en": "Where do you live?",
          "uz": "Siz qayerda yashaysiz?",
          "focusWord": "live",
          "tokens": ["where", "do", "you", "live"]
        }
      ]
    },
    {
      "level": "a2",
      "title": "Elementary",
      "words": [],
      "sentences": []
    },
    {
      "level": "b1",
      "title": "Intermediate",
      "words": [],
      "sentences": []
    },
    {
      "level": "b2",
      "title": "Upper-Intermediate",
      "words": [],
      "sentences": []
    },
    {
      "level": "c1",
      "title": "Advanced",
      "words": [],
      "sentences": []
    },
    {
      "level": "c2",
      "title": "Proficiency",
      "words": [],
      "sentences": []
    }
  ]
}
```

---

## 4. Best Practices for Adding Words

1. **Single-Word Consistency:** In the `words` array, keep `en` and `uz` to a single distinct term (e.g., `brave` and `jasur`). Secondary translations belong in the `synonyms` array. This ensures an optimal experience for the ghost-letter typing exercise.
2. **Casing & Normalization:** Enter terms in lowercase. The system automatically handles normalization and case-insensitivity at runtime.
3. **Apostrophes in Uzbek:** Standard apostrophes (`'`) are recommended for Uzbek letters like `o'`, `g'`. The validation engine normalizes typographic variants (`‘`, `’`) seamlessly.
