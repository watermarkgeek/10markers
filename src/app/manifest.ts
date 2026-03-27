import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The 10 Markers",
    short_name: "10 Markers",
    description:
      "Learn the 10 markers of a disciple of Jesus — from Watermark Community Church.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a2744",
    theme_color: "#1a2744",
    categories: ["education", "lifestyle"],
    icons: [
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
