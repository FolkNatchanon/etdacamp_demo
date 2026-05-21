import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Trust Rental Platform - Mobile Demo',
  description: 'Interactive Trust Rental Platform Prototype running on Next.js & Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[#F5F6FA] text-slate-900 flex flex-col overflow-x-hidden relative">
        {/* Content Wrapper */}
        <div className="w-full flex-1 flex flex-col relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
