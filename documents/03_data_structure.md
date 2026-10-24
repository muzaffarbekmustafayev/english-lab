# 03. Ma'lumotlar Tuzilishi (Data Structure & JSON)

## 1. Umumiy Konseptsiya

Barcha so'zlar loyihaning GitHub repozitoriysida joylashgan `data/words.json` faylida saqlanadi. Foydalanuvchi bu faylni to'g'ridan-to'g'ri GitHub veb-saytida yoki o'z kompyuterida ochib, yangi so'zlarni qo'lda qo'shib boradi.

---

## 2. TypeScript Interfeysi (Data Schema)

```typescript
export interface WordItem {
  id: string;                // Yagona identifikator (masalan: "w-001" yoki avtomatik UUID)
  en: string;                // Ingliz tilidagi so'z yoki ibora (masalan: "resilient")
  uz: string;                // O'zbek tilidagi tarjimasi (masalan: "bardoshli, chidamli")
  category?: string;         // Kategoriya (masalan: "IT", "General", "Academic", "Daily")
  level?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"; // Qiyinlik darajasi (ixtiyoriy)
  example?: {
    en: string;              // Inglizcha misol gap
    uz: string;              // Misol gapning o'zbekcha tarjimasi
  };
  hint?: string;             // Yordamchi belgi / sinonim (ixtiyoriy)
}

export type WordsDatabase = WordItem[];
```

---

## 3. `data/words.json` Fayli Namunasi

Quyida `data/words.json` faylining to'liq ishchi namunasi keltirilgan:

```json
[
  {
    "id": "w-001",
    "en": "brave",
    "uz": "jasur",
    "category": "General",
    "level": "A2",
    "example": {
      "en": "He is a brave soldier.",
      "uz": "U jasur askardir."
    }
  },
  {
    "id": "w-002",
    "en": "resilient",
    "uz": "bardoshli",
    "category": "General",
    "level": "B2",
    "example": {
      "en": "She remained resilient under pressure.",
      "uz": "U bosim ostida bardoshli bo'lib qoldi."
    },
    "hint": "chidamli, tez tiklanuvchi"
  },
  {
    "id": "w-003",
    "en": "knowledge",
    "uz": "bilim",
    "category": "Education",
    "level": "A2",
    "example": {
      "en": "Knowledge is power.",
      "uz": "Bilim — kuchdir."
    }
  },
  {
    "id": "w-004",
    "en": "implement",
    "uz": "joriy etmoq",
    "category": "IT",
    "level": "B1"
  },
  {
    "id": "w-005",
    "en": "victory",
    "uz": "g'alaba",
    "category": "General",
    "level": "B1"
  },
  {
    "id": "w-006",
    "en": "versatile",
    "uz": "universal",
    "category": "General",
    "level": "C1",
    "hint": "ko'p qirrali"
  }
]
```

---

## 4. So'zlarni Qo'lda Kiritish Qoidalari va Tavsiyalar

1. **Kichik harflar bilan kiritish (Case Normalization):**
   - So'zlarning asosiy qismini kichik harflarda yozish tavsiya etiladi (masalan: `"en": "perseverance"`). Dastur tekshirish paytida katta-kichik harflarni avtomatik bir xil shaklga keltiradi (`.toLowerCase().trim()`).

2. **O'zbekcha maxsus harflar (O', G', Tutuq belgisi):**
   - O'zbek tilidagi `o'`, `g'` harflari uchun standart bitta belgi yoki apostrof (`'`) ishlatilishi lozim. Ilova harf solishtirganda `‘`, `’`, `'` belgilarini bir xil deb hisoblash filtri bilan himoyalanadi.

3. **Bir nechta ma'nolar (Sinonimlar):**
   - Agar so'zning bir nechta tarjimasi bo'lsa, ularni vergul bilan ajratib yozish maqsadga muvofiq: `"uz": "bardoshli, chidamli"`.
   - Harf terish rejimida esa asosiy qidirilayotgan so'z inglizcha (`"en"`) bo'lgani sababli, inglizcha qism yagona aniq so'z bo'lishi qulayroq.

4. **JSON Sintaksisi Xatolarini Oldini Olish:**
   - Har bir obyekt oxirida vergul qo'yiladi, lekin eng oxirgi obyekt oxirida vergul qo'yilmaydi.
   - Matnlar doimo qo'shtirnoq (`"..."`) ichida yoziladi.
   - So'zlar soni kamida **20 ta** bo'lishi shart (chunki har bir test sessiyasi 20 ta savoldan iborat).
