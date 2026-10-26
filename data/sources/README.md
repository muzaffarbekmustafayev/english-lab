# English Lab - Manbalar va Lug'at Fondi (Vocabulary Sources)

Ushbu katalogda ingliz tili so'z boyligini kengaytirish uchun foydalanilgan xalqaro standart manbalar (PDF, JSON) va ularning qayta ishlangan nusxalari jamlangan.

---

## 📚 1. Asosiy Manbalar

### A. Oxford 3000™ & Oxford 5000™ (CEFR A1–C1)
Oxford 3000 va 5000 — ingliz tilini o'rganuvchilar uchun eng muhim va nufuzli so'zlar ro'yxatidir.
* **Rasmiy sahifa:** [Oxford Learner's Dictionaries Wordlists](https://www.oxfordlearnersdictionaries.com/about/wordlists/oxford3000-5000)
* **Lokal fayllar:**
  * [`The_Oxford_3000_by_CEFR_level.pdf`](./The_Oxford_3000_by_CEFR_level.pdf) — Oxford 3000 so'zlarining A1, A2, B1, B2 darajalari bo'yicha taqsimoti.
  * [`The_Oxford_5000_by_CEFR_level.pdf`](./The_Oxford_5000_by_CEFR_level.pdf) — Oxford 5000 qo'shimcha so'zlarining B2 va C1 darajalari bo'yicha taqsimoti.
  * [`The_Oxford_5000.pdf`](./The_Oxford_5000.pdf) — Rasmiy Oxford 5000 to'liq ro'yxat hujjati.
  * [`oxford_5000_raw.json`](./oxford_5000_raw.json) — 5,944 ta yozuvdan iborat to'liq strukturalangan baza (so'z, so'z turkumi, CEFR darajasi, fonetika, inglizcha ta'rif, misol jumlalar).

### B. Langeek CEFR English Vocabulary (A1–C1)
Langeek tomonidan taqdim etilgan mavzular bo'yicha tasniflangan, ta'rif va talaffuzli so'zliklar.
* **Rasmiy sahifa:** [Langeek CEFR Vocabulary Lists](https://help.langeek.co/cefr-english-vocabulary-pdf/)
* **Lokal fayllar:**
  * [`Langeek_A1.pdf`](./Langeek_A1.pdf) — Beginner darajasi (31 bet)
  * [`Langeek_A2.pdf`](./Langeek_A2.pdf) — Elementary darajasi (74 bet)
  * [`Langeek_B1.pdf`](./Langeek_B1.pdf) — Intermediate darajasi (85 bet)
  * [`Langeek_B2.pdf`](./Langeek_B2.pdf) — Upper-Intermediate darajasi (102 bet)
  * [`Langeek_C1.pdf`](./Langeek_C1.pdf) — Advanced darajasi (113 bet)

### C. English Profile / English Vocabulary Profile (EVP)
Cambridge University Press va Cambridge English hamkorligida yaratilgan CEFR (A1–C2) mezonlari.
* **Rasmiy havola:** [English Profile EVP](https://www.englishprofile.org/wordlists/evp)
* Oxford 3000/5000 va Langeek manbalaridagi CEFR standartlari to'liq EVP darajalariga mos keladi.

---

## ⚙️ 2. Avtomatlashtirilgan Integratsiya Pipeline

Manbalardagi so'zlarni qayta ishlash, so'z turkumlarini moslashtirish, o'zbek tiliga tarjima qilish va `data/words.json` bazasiga birlashtirish uchun quyidagi skript yaratilgan:

```bash
python scripts/import_vocabulary.py
```

### Xususiyatlari:
1. **Mavjud ma'lumotlarni saqlash:** `data/words.json` dagi qo'lda kiritilgan so'zlar va test gaplari to'liq saqlanadi, qayta yozilmaydi. Avval zaxira nusxasi `data/words.backup.json` ga olinadi.
2. **Kesh tizimi (`translations_cache.json`):** Tarjima qilingan so'zlar saqlanadi, qayta ishga tushirilganda faqat yangi so'zlar tarjima qilinadi.
3. **Strukturaga moslashtirish:** Har bir so'zga unikal ID (`a1-w-0001` formatida), `type` (noun, verb, adjective, adverb, phrase, other), inglizcha ta'rif (`hint`), va misol jumlalar biriktiriladi.

---

## 📊 3. Hozirgi Holat (Darajalar bo'yicha so'zlar soni)

* **A1 (Beginner):** 898 ta so'z
* **A2 (Elementary):** 870 ta so'z
* **B1 (Intermediate):** 807 ta so'z
* **B2 (Upper-Intermediate):** 1,433 ta so'z
* **C1 (Advanced):** 1,317 ta so'z
* **C2 (Proficiency):** 3 ta so'z
* **Jami:** **5,328 ta so'z**
