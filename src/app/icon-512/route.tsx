import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#1a2744",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 280, lineHeight: 1 }}>✝</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#c8973a",
            letterSpacing: 6,
          }}
        >
          10
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
