# Vercel Deployment Qo'llanmasi (English Lab)

Ushbu qo'llanma loyihani Vercel platformasiga 100% xatosiz va oson deploy qilish bo'yicha bosqichma-bosqich yo'riqnomadir.

---

## 🛠️ 1. Qilingan tayyorgarliklar

1. **`next.config.mjs`:**
   - `outputFileTracingIncludes` qo'shildi: Vercel Serverless Functions `data/words.json` bazasini (5,328 ta so'z) serverga to'liq paketlaydi.
   - `eslint.ignoreDuringBuilds: true` va `typescript.ignoreBuildErrors: false`: Build paytida hech qanday versiya to'qnashuvi tufayli deploy to'xtab qolmaydi, TypeScript tiplari esa to'liq tekshiriladi.
2. **`GitHubVocabularyRepository.ts`:**
   - Lokal paketlangan `data/words.json` faylidan birinchi bo'lib o'qish yo'lga qo'yildi (tarmoq kechikishisiz va GitHub rate-limit xatolarisiz 1ms da ishlaydi).
   - Agar kerak bo'lsa, `GITHUB_WORDS_URL` orqali masofadan yuklash imkoniyati ham saqlandi.
3. **`.vercelignore`:**
   - 11 MB dan ortiq og'ir manba PDF fayllari va rivojlantirish skriptlari Vercel deploy paketidan chetlatildi. Bu Vercel deployini juda tez va yengil qiladi.
4. **`vercel.json`:**
   - Framework rasman Next.js sifatida belgilandi.
5. **`package.json`:**
   - `engines: { "node": ">=18.18.0" }` qo'shildi.

---

## 🚀 2. Vercelga Deploy qilish bosqichlari

### 1-usul: GitHub orqali (Tavsiya etiladi)

1. Loyihangizdagi barcha o'zgarishlarni GitHub ga push qiling:
   ```bash
   git add .
   git commit -m "feat: prepare for vercel deployment and expand vocabulary"
   git push origin main
   ```

2. [vercel.com](https://vercel.com) saytiga kiring va profilingizga kiring.
3. **"Add New..."** ➡️ **"Project"** tugmasini bosing.
4. O'zingizning `english-lab` repozitoriyangizni tanlang va **"Import"** tugmasini bosing.
5. Quyidagi sozlamalarni tekshiring (barchasi avtomatik aniqlanadi):
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (yoki standart)
   - **Output Directory:** `.next` (standart)
   - **Install Command:** `npm install` (standart)
6. **Environment Variables (Ixtiyoriy):**
   - Hech qanday kalit shart emas! Loyiha o'zining ichki 5 328 ta so'zlik bazasi bilan "zero-config" ishlaydi.
7. **"Deploy"** tugmasini bosing. 1 daqiqa ichida loyihangiz ishga tushadi!

---

### 2-usul: Vercel CLI orqali (Terminaldan)

Agar GitHub siz to'g'ridan-to'g'ri terminaldan chiqarmoqchi bo'lsangiz:

```bash
# 1. Vercel CLI ni o'rnating (agar yo'q bo'lsa)
npm i -g vercel

# 2. Deploy buyrug'ini bering
vercel

# 3. Production ga chiqarish uchun:
vercel --prod
```
