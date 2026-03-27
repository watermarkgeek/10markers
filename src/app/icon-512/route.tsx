import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const logoData = readFileSync(join(process.cwd(), "public/wm-logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={512} height={512} alt="Watermark" />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
