import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoFinance",
  description: "The next gen DeFi Earning Platform",
  icons: {
    icon: '/favicon.ico',
  },
};

const ServerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="relative w-full flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};

export default ServerLayout;