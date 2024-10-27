import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "../components/navigation/Navbar";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { Providers } from "@/components/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Meal Planner",
  description: "Plan your meals with AI assistance",
};

// Create a client

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <ThemeProvider>
        <Providers>
          <body className="antialiased bg-background text-foreground font-sans">
            <div className="flex flex-col h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
            </div>
          </body>
        </Providers>
      </ThemeProvider>
    </html>
  );
}
