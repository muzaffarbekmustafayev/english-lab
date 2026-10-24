# 03. Ma'lumotlar Tuzilishi (Data Structure & JSON)

## 1. Umumiy Konseptsiya

Barcha ma'lumotlar loyihaning GitHub repozitoriysida joylashgan `data/words.json` yagona faylida saqlanadi. Ma'lumotlar strukturalangan, o'qilishi oson va CEFR xalqaro darajalari bo'yicha (**A1, A2, B1, B2, C1, C2**) guruhlangan.

Har bir daraja ichida ikkita asosiy qism mavjud:
1. **`words` (Bittalik so'zlar):** Aniq, sodda va bitta so'zdan iborat leksika (masalan: `water` ➡️ `suv`, `brave` ➡️ `jasur`). Harf terish (Letter Box) va test uchun eng qulay format.
2. **`sentences` (Gaplar / Iboralar):** So'zning kontekstdagi ishlatilishi, gap tuzilishi va to'liq jumlalar (masalan: *"Where do you live?"* ➡️ *"Siz qayerda yashaysiz?"*).

---

## 2. TypeScript Interfeysi (Hierarchical Data Schema)

```typescript
export type CEFRLevel = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export interface ExampleItem {
  en: string;
  uz: string;
}

export interface WordItem {
  id: string;               // Yagona ID (masalan: "a1-w-001")
  en: string;               // Bittalik inglizcha so'z (masalan: "brave")
  uz: string;               // Bittalik o'zbekcha tarjimasi (masalan: "jasur")
  type?: "noun" | "verb" | "adjective" | "adverb"; // So'z turkumi
  synonyms?: string[];      // Sinonimlar massivi (array)
  examples?: ExampleItem[]; // Misol gaplar massivi (array of objects)
  hint?: string;            // Qisqa yordamchi belgi
}

export interface SentenceItem {
  id: string;               // Gap ID si (masalan: "a1-s-001")
  en: string;               // Inglizcha to'liq gap
  uz: string;               // O'zbekcha to'liq tarjima
  focusWord?: string;       // Gapdagi asosiy e'tibor qaratilgan so'z
  tokens?: string[];        // Gapning bo'laklarga ajratilgan so'zlari massivi
}

export interface LevelGroup {
  level: CEFRLevel;         // "a1" | "a2" | "b1" | "b2" | "c1" | "c2"
  title: string;            // "Beginner", "Elementary", "Intermediate" va h.k.
  description: string;      // Qisqa tavsif
  words: WordItem[];        // Bittalik so'zlar ro'yxati (Array)
  sentences: SentenceItem[];// To'liq gaplar ro'yxati (Array)
}

export interface DatabaseSchema {
  levels: LevelGroup[];     // Darajalar massivi
}
```

---

## 3. `data/words.json` Fayli Strukturasi (Ierarxik Ko'rinish)

```json
{
  "levels": [
    {
      "level": "a1",
      "title": "Beginner",
      "description": "Boshlang'ich darajadagi eng sodda va kundalik so'zlar hamda gaplar",
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

## 4. Ma'lumotlarni Filtrlash va Olish Yordamchi Funksiyalari (Helpers)

Next.js backend yoki frontend qismida ma'lumotlarni oson va qulay olish uchun quyidagi yordamchi funksiyalar ishlatiladi:

```typescript
import db from "@/data/words.json";
import { DatabaseSchema, WordItem, SentenceItem, CEFRLevel } from "@/types/word";

const database = db as DatabaseSchema;

// 1. Tanlangan daraja bo'yicha so'zlarni olish (masalan, faqat B2)
export function getWordsByLevel(level: CEFRLevel): WordItem[] {
  const group = database.levels.find((g) => g.level === level);
  return group ? group.words : [];
}

// 2. Barcha darajalardagi bittalik so'zlarni bitta tekis massivga yig'ish (Flatten all words)
export function getAllWords(): (WordItem & { level: CEFRLevel })[] {
  return database.levels.flatMap((g) =>
    g.words.map((w) => ({ ...w, level: g.level }))
  );
}

// 3. Tanlangan daraja bo'yicha gaplarni olish
export function getSentencesByLevel(level: CEFRLevel): SentenceItem[] {
  const group = database.levels.find((g) => g.level === level);
  return group ? group.sentences : [];
}

// 4. Barcha gaplarni bitta tekis massivga yig'ish
export function getAllSentences(): (SentenceItem & { level: CEFRLevel })[] {
  return database.levels.flatMap((g) =>
    g.sentences.map((s) => ({ ...s, level: g.level }))
  );
}
```

---

## 5. Yangi So'z va Gap Qo'shish Qoidalari

1. **Daraja mosligi:** Yangi so'z CEFR darajasiga mos ravishda tegishli `level` obyektining `words` yoki `sentences` massiviga qo'shiladi.
2. **Bittalik so'z qoidasi:** `words` qatoridagi `en` va `uz` bitta aniq so'z bo'lishi lozim (harf terish o'yinida foydalanuvchiga qulay bo'lishi uchun). Qo'shimcha ma'nolari `synonyms: ["...", "..."]` massiviga yoziladi.
3. **Misollar (examples):** So'zning gapda qanday ishlatilishini ko'rsatish uchun `examples: [{ en: "...", uz: "..." }]` obyektlari qo'shiladi.
