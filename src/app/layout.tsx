import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIGGGIN - DISCDIGGER",
  description: "A modern art gallery showcasing psychedelic and contemporary artwork with music connections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
