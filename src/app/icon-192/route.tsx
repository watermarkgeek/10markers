import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "#1a2744",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <div style={{ fontSize: 100, lineHeight: 1 }}>✝</div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#c8973a",
            letterSpacing: 2,
          }}
        >
          10
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
