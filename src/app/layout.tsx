import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

export const metadata: Metadata = {
  title: "Sahara – World's Largest Supersite",
  description: "One destination. Infinite possibilities. Discover a universe of entertainment, knowledge, and creativity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
          <LanguageSelector />
        </LanguageProvider>
      </body>
    </html>
  );
}
