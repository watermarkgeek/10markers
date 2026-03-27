import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#1a2744",
          borderRadius: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 80, lineHeight: 1 }}>✝</div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#c8973a",
            letterSpacing: 1,
          }}
        >
          10
        </div>
      </div>
    ),
    { ...size }
  );
}
