import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sweepstake Pages",
  description: "Sports prediction sweepstake tracker",
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
