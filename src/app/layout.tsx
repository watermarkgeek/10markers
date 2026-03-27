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
  themeColor: "#1a2744",
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
        {/* Splash screen background while app loads */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="10 Markers" />
      </head>
      <body className="h-full bg-[#1a2744]">
        {/* bg-[#1a2744] on body = navy shows during overscroll / safe area */}
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
