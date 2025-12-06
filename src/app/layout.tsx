import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zest - Your Financial Bestie",
  description: "Gen Z Banking Reimagined",
};

import { AgentProvider } from "@/context/AgentContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AgentProvider>
          <div className="container">
            {children}
          </div>
        </AgentProvider>
      </body>
    </html>
  );
}
