import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The 10 Markers",
  description:
    "Learn the 10 markers of a disciple of Jesus — from Watermark Community Church.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#f8f5f0]">
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
