import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Lab — Interaktiv So'z Boyligi Laboratoriyasi",
  description:
    "20 talik test va harf terish (Letter Box) mashqlari orqali ingliz tili lug'atini mustahkamlash uchun shaxsiy laboratoriya.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#030a1c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark scroll-smooth">
      <head>
        {/* Tailwind CSS CDN integratsiyasi */}
        <Script
          src="https://cdn.tailwindcss.com"
          strategy="beforeInteractive"
        />
        {/* Tailwind Dark Blue Glassmorphism konfiguratsiyasi */}
        <Script id="tailwind-config" strategy="beforeInteractive">
          {`
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    navy: {
                      950: '#020617',
                      900: '#030a1c',
                      850: '#06132e',
                      800: '#0a1a3e',
                      700: '#0f275c',
                      600: '#1e3a8a',
                      500: '#2563eb',
                      400: '#38bdf8',
                      300: '#7dd3fc',
                    },
                    brand: {
                      50: '#f0f9ff',
                      100: '#e0f2fe',
                      200: '#bae6fd',
                      300: '#7dd3fc',
                      400: '#38bdf8',
                      500: '#0284c7',
                      600: '#0369a1',
                      700: '#075985',
                    }
                  },
                  screens: {
                    'xs': '420px',
                  }
                }
              }
            }
          `}
        </Script>
      </head>
      <body className="bg-navy-950 text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
