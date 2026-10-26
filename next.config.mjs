/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Vercel build paytida linter xatoliklari sababli build to'xtab qolishining oldini olish
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript xatolari qat'iy tekshiriladi
    ignoreBuildErrors: false,
  },
  outputFileTracingIncludes: {
    // Vercel Serverless Functions data/words.json faylini to'liq paketlashi uchun
    '/api/**/*': ['./data/words.json'],
  },
};

export default nextConfig;
