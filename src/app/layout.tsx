import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "LifeGame | Gamify Your Life",
  description: "A minimalist sharp app to gamify your life and goals.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <Providers>
          <div className="container">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
