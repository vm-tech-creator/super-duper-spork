import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SiteChrome from "@/components/SiteChrome";

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
    <html lang="en" suppressHydrationWarning>
      <body className="themed-body">
        <LanguageProvider>
          <ThemeProvider>
            <SiteChrome>{children}</SiteChrome>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
