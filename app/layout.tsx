import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "AfriStock — Authentic African Visuals",
  description: "Thousands of images, vectors & footage from across the African continent — licensed and ready to use.",
  openGraph: {
    title: "AfriStock",
    description: "Authentic African visuals, built for creators.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#FBF6EE] text-[#2C1A0E] antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-[#E2D8C8] mt-20 py-10 text-center text-sm text-[#A08060]">
          <p>© {new Date().getFullYear()} AfriStock. Empowering African creators worldwide.</p>
        </footer>
      </body>
    </html>
  );
}
