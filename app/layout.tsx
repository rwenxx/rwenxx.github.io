import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const marker = Caveat({ weight: "700", subsets: ["latin", "cyrillic"], variable: "--font-marker" });

export const metadata: Metadata = {
  title: "Isa D. | Full-Stack & DevOps Engineer",
  description: "Digital scrapbook portfolio of Isa D. Bridging the gap between code and infrastructure.",
  openGraph: {
    title: "Isa D. | Full-Stack & DevOps Engineer",
    description: "Digital scrapbook portfolio. Bridging the gap between code and infrastructure.",
    url: "https://isa-portfolio.vercel.app",
    siteName: "Isa D. Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isa D. | Full-Stack & DevOps Engineer",
    description: "Digital scrapbook portfolio of Isa D.",
  }
};

import { GlobalAudioProvider } from "@/context/AudioContext";
import MiniPlayer from "@/components/MiniPlayer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${marker.variable} font-sans`}>
        <CustomCursor />
        <GlobalAudioProvider>
          {children}
          <MiniPlayer />
        </GlobalAudioProvider>
      </body>
    </html>
  );
}
