import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "../components/navigation/Navbar";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <ThemeProvider>
        <Providers>
          <body className="bg-background font-sans text-foreground antialiased">
            <div className="flex h-screen flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
            </div>
            <Toaster />
          </body>
        </Providers>
      </ThemeProvider>
    </html>
  );
}
