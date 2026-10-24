# English Lab — Hujjatlar To'plami (Documentation)

**English Lab** — foydalanuvchiga ingliz tili lug'at boyligini (vocabulary) samarali oshirishga mo'ljallangan, shaxsiy foydalanish uchun yaratilayotgan zamonaviy veb-platforma. Loyiha **Next.js (React / Node.js)** texnologiyasida quriladi, ma'lumotlar bazasi sifatida **GitHub repozitoriysidagi JSON fayllardan** foydalanadi va **Vercel** platformasiga deploy qilinadi.

Ushbu `documents/` papkasida loyihaning to'liq arxitekturasi, ishlash mexanizmlari, ma'lumotlar tuzilishi, o'yin rejimlari va texnik spetsifikatsiyalari yozilgan.

---

## 📑 Hujjatlar Mundarijasi

| Fayl | Nomi | Tavsifi |
| :--- | :--- | :--- |
| [01_overview.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/01_overview.md) | **Loyihaning Umumiy Tavsifi** | Loyiha maqsadi, asosiy xususiyatlari, talablar va texnologiyalar steki |
| [02_architecture.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/02_architecture.md) | **Texnik Arxitektura** | Next.js App Router, GitHub Data Fetching (Server-Side / ISR), Vercel integratsiyasi |
| [03_data_structure.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/03_data_structure.md) | **Ma'lumotlar Tuzilishi (JSON)** | So'zlar bazasi formati, schema, validatsiya va yangi so'zlarni kiritish tartibi |
| [04_game_modes_and_logic.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/04_game_modes_and_logic.md) | **O'yin Rejimlari va Ishlash Logikasi** | 20 talik sessiya, Test (Quiz) rejimi, Harf terish (Letter Fill) rejimi, UZ↔EN yo'nalishlar |
| [05_ui_ux_flow.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/05_ui_ux_flow.md) | **UI/UX Dizayn va Foydalanuvchi Oqimi** | Ekranlar, komponentlar, klaviatura boshqaruvi, animatsiyalar va dizayn qoidalari |
| [06_roadmap.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/06_roadmap.md) | **Bosqichma-bosqich Reja (Roadmap)** | Loyihani ishga tushirish, dasturlash va Vercel-ga yuklash bosqichlari |

---

## 🚀 Loyihaning Qisqa Xulosasi

- **Maqsad:** Shaxsiy lug'atni qo'lda kiritish va doimiy takrorlab mustahkamlash.
- **Asosiy mexanika:**
  - Har bir mashg'ulotda random tarzda tanlangan **20 ta so'z** beriladi.
  - 2 xil yo'nalish: **O'zbekcha ➡️ Inglizcha** va **Inglizcha ➡️ O'zbekcha**.
  - 2 xil mashq usuli:
    1. **Quiz Test:** 4 ta variantdan to'g'ri javobni tanlash.
    2. **Harf to'ldirish (Letter Box):** Chapda so'z chiqadi, o'ngda disable katakchalar turadi — harflar klaviatura yoki tugmalar orqali to'ldiriladi.
- **Baza:** GitHub repoda saqlanuvchi `words.json` fayli (ortiqcha murakkab ma'lumotlar bazasiga hojat yo'q).
- **Deploy:** Vercel (bepul, avtomatlashgan CI/CD, tezkor Edge keshlash).
