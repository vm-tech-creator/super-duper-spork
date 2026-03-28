import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
