// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Используем sonner для уведомлений

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CDEK_Digital SQL Battle",
  description: "Платформа для проведения SQL-баттлов от CDEK_Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}