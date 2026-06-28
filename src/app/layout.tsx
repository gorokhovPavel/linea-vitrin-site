import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe Venture — инвестиции в ранние ИИ-стартапы",
  description:
    "Микрогранты, экспертиза и первые интро для команд с ИИ-проектом на ранней стадии.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={geist.variable}>
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
