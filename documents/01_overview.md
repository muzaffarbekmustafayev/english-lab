# 01. Loyihaning Umumiy Tavsifi (Overview)

## 1. Kirish va Maqsad

**English Lab** — ingliz tili lug'atini (vocabulary) individual va samarali o'rganish uchun mo'ljallangan yengil, tezkor va interaktiv veb-ilova.

Ko'pgina o'quv dasturlarida (masalan, Duolingo, Memrise yoki Anki) tayyor lug'at bazalari beriladi va ular ko'pincha foydalanuvchining shaxsiy ehtiyojlariga (kundalik ishda, texnik sohada yoki kitob o'qishda uchragan yangi so'zlarga) to'liq mos kelmaydi. **English Lab** loyihasining asosiy g'oyasi — foydalanuvchi o'zi o'rganmoqchi bo'lgan so'zlarni bevosita **GitHub repozitoriysidagi JSON faylga qo'lda kiritadi**, ilova esa ushbu bazadan foydalanib o'yinlashtirilgan interaktiv mashg'ulotlar yaratib beradi.

---

## 2. Asosiy Talablar va Funksionallik

1. **Qo'lda kiritiladigan lug'at bazasi (Manual Word Management):**
   - So'zlar ingliz tilida va ularning o'zbek tilidagi tarjimasi bilan birga kiritiladi.
   - Baza alohida murakkab ma'lumotlar bazasisiz (PostgreSQL, MongoDB talab qilinmaydi), to'g'ridan-to'g'ri GitHub repozitoriysidagi `data/words.json` faylida saqlanadi.
   - Yangi so'z qo'shish uchun GitHub veb-interfeysi yoki VS Code/git orqali JSON faylni tahrirlash kifoya.

2. **20 talik tasodifiy sessiya (Randomized 20-word Quizzes):**
   - Har bir o'quv sessiyasi umumiy bazadan tasodifiy (random) tartibda tanlab olingan **aniq 20 ta so'zdan** iborat bo'ladi.
   - 20 ta so'z tugagach, foydalanuvchiga natijalar, to'g'ri/xato javoblar va xato qilingan so'zlar ro'yxati ko'rsatiladi.

3. **2 xil yo'nalish (Bilingual Learning Modes):**
   - **O'zbekcha ➡️ Inglizcha (UZ ➡️ EN):** Savol sifatida o'zbekcha so'z beriladi, foydalanuvchi inglizchasini topadi/yozadi.
   - **Inglizcha ➡️ O'zbekcha (EN ➡️ UZ):** Savol sifatida inglizcha so'z beriladi, foydalanuvchi o'zbekchasini topadi/yozadi.

4. **2 xil mashq uslubi (Exercise Modes):**
   - **Rejim A: Quiz Test (Ko'p tanlovli test):**
     - Ekranda bitta so'z va uning ostida 4 ta javob varianti (1 ta to'g'ri va 3 ta bazadan olingan chalg'ituvchi variant).
   - **Rejim B: Harf to'ldirish (Letter Box / Interactive Spelling):**
     - Ekranning chap tomonida savol so'z (masalan, o'zbekcha yoki inglizcha tarjimasi) chiqadi.
     - O'ng tomonida esa javob so'zining harflari soniga teng bo'lgan yopiq/disable katakchalar turadi.
     - Foydalanuvchi klaviatura orqali harflarni ketma-ket to'g'ri kiritadi yoki ekrandagi harf klaviaturasidan foydalanadi.

5. **Deploy va Arxitektura:**
   - **Framework:** Next.js (App Router, React 19 / Node.js).
   - **Hosting:** Vercel (avtomatik yangilanish, bepul, SSL bilan, yuqori tezlik).
   - **Shaxsiy foydalanish (Single-user / Self-hosted focus):** Foydalanuvchining o'zi uchun ortiqcha registratsiya va murakkab tokenlarsiz qulay ishlash.

---

## 3. Loyihaning Afzalliklari

- ⚡ **Tezkor va yengil:** Og'ir SQL/NoSQL bazalari yo'q; ma'lumotlar to'g'ridan-to'g'ri GitHub orqali olinadi va keshlanadi.
- 🔒 **Versiyalar nazorati (Git versioning):** Har bir qo'shilgan so'z git commit orqali tarixda qoladi, ma'lumotlar yo'qolmaydi.
- 📱 **To'liq adaptiv (Responsive):** Telefon, planshet va kompyuterda bir xil qulaylikda ishlaydi.
- 🧠 **Faol eslab qolish (Active Recall):** Shunchaki ko'rish emas, balki so'zni harfma-harf terish orqali imlo (spelling) va xotirani mustahkamlash.
