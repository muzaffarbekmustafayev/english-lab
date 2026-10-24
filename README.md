# 🧪 English Lab

> **Shaxsiy ingliz tili so'z boyligini oshirish uchun mo'ljallangan interaktiv veb-laboratoriya.**

Loyiha **Next.js (React / Node.js)** bazasida quriladi va **Vercel** platformasiga deploy qilinadi. Baza sifatida **GitHub repodagi `data/words.json`** fayli ishlatiladi. Dizayn va stillar **Tailwind CSS (CDN)** orqali ta'minlanadi.

---

## 🎯 Asosiy Imkoniyatlar

- 🎲 **20 talik tasodifiy sessiyalar:** Bazadagi so'zlardan random tarzda 20 tasi tanlanadi.
- 🔄 **2 xil yo'nalish:**
  - `O'zbekcha ➡️ Inglizcha`
  - `Inglizcha ➡️ O'zbekcha`
- 🎮 **2 xil mashg'ulot rejimi:**
  1. **Quiz Test:** 4 ta variantdan to'g'ri javobni tanlash (klaviaturada `1, 2, 3, 4`).
  2. **Harf to'ldirish (Letter Box):** Chapda so'z chiqadi, o'ngda disable katakchalarga harflar klaviatura yoki harf tugmalari orqali kiritiladi.
- 🔤 **Bittalik va aniq so'zlar:** Lug'at bazasi qulay terish uchun bittalik so'zlar (`brave` ➡️ `jasur`) hamda boyitilgan iboralar bilan ta'minlangan.
- ⚡ **Yengil va mustaqil (Serverless):** Og'ir ma'lumotlar bazasisiz, to'g'ridan-to'g'ri GitHub repodan JSON ma'lumotlar olinadi va Next.js ISR orqali keshlanadi.
- 🎨 **Tailwind CSS (CDN):** Ortiqcha PostCSS yuklamalarisiz, tezkor va zamonaviy UI.
- 📊 **Natijalar va Xatolar tahlili:** 20 ta savoldan so'ng aniqlik foizi, sarflangan vaqt va xato qilingan so'zlarni qayta mashq qilish imkoniyati.

---

## 📚 Batafsil Hujjatlar (Documentation)

Barcha texnik spetsifikatsiyalar va ishlash logikasi [`documents/`](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents) papkasida batafsil yozilgan:

1. [01_overview.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/01_overview.md) — Loyihaning umumiy tavsifi va talablari.
2. [02_architecture.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/02_architecture.md) — Texnik arxitektura, GitHub Data Fetching, Tailwind CDN va Vercel.
3. [03_data_structure.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/03_data_structure.md) — JSON schema, bittalik so'zlar va qo'lda kiritish tartibi.
4. [04_game_modes_and_logic.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/04_game_modes_and_logic.md) — 20 talik generator, Test va Harf terish logikasi.
5. [05_ui_ux_flow.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/05_ui_ux_flow.md) — UI/UX dizayn, ekranlar, klaviatura boshqaruvi.
6. [06_roadmap.md](file:///c:/Users/muzaf/Desktop/mzfck/projects/english-lab/documents/06_roadmap.md) — Bosqichma-bosqich ishlab chiqish rejasi.

---

## 📂 Loyiha Tuzilishi

```text
english-lab/
├── .gitignore               # Git uchun istisnolar (node_modules, .next, .env va h.k.)
├── README.md                # Asosiy tanishtiruv
├── data/
│   └── words.json           # So'zlar bazasi (qo'lda kiritiladi va boyitiladi)
└── documents/               # To'liq texnik hujjatlar (.md)
    ├── README.md            # Hujjatlar mundarijasi
    ├── 01_overview.md       # Umumiy tavsif
    ├── 02_architecture.md   # Texnik arxitektura & Tailwind CDN
    ├── 03_data_structure.md # JSON ma'lumotlar sxemasi
    ├── 04_game_modes_and_logic.md # O'yin logikasi
    ├── 05_ui_ux_flow.md     # Dizayn va interfeys
    └── 06_roadmap.md        # Ish rejasi
```

---

## 🔗 GitHub Repozitoriy

- Repozitoriy: [https://github.com/muzaffarbekmustafayev/english-lab.git](https://github.com/muzaffarbekmustafayev/english-lab.git)
