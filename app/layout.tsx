import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PL Sweepstake 2024/25",
  description: "Premier League prediction sweepstake tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dracula">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
