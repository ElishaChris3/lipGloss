import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your lips, your honest take",
  description: "A 2 minute survey about lip products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
