import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Lab — Personal Vocabulary Laboratory",
  description:
    "Interactive 20-question quiz and letter-box spelling platform powered by Next.js and GitHub repository storage.",
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
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Tailwind CSS CDN scripti to'g'ridan-to'g'ri native script orqali */}
        <script src="https://cdn.tailwindcss.com" async={false}></script>
        {/* Tailwind Dark Blue Glassmorphism konfiguratsiyasi */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
              };
            `,
          }}
        />
      </head>
      <body className="bg-[#020617] text-slate-100 min-h-screen antialiased selection:bg-cyan-500 selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
