import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The 10 Markers",
  description:
    "Learn the 10 markers of a disciple of Jesus — from Watermark Community Church.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "10 Markers",
  },
  formatDetection: {
    telephone: false,
  },
};

// Separate viewport export — required in Next.js 14+
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // lets content flow under the iPhone notch/dynamic island
  themeColor: "#28312f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* iOS standalone — show full screen when launched from home screen */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="10 Markers" />
        {/* Google Fonts — Oswald (headings/display) + Lato (body/UI) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap"
        />
      </head>
      <body className="h-full bg-[#28312f]">
        {/* bg-[#28312f] on body = Watermark dark charcoal shows during overscroll / safe area */}
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
