import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { ThemeProvider } from "../components/ThemeProvider";
import { SupabaseProvider } from "@/components/SupabaseProvider";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <ThemeProvider>
        <SupabaseProvider>
          <body className="antialiased bg-background text-foreground font-sans">
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex flex-col flex-grow container mx-auto p-4 h-full">
                {children}
              </main>
            </div>
          </body>
        </SupabaseProvider>
      </ThemeProvider>
    </html>
  );
}
