import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Repostly — YouTube to LinkedIn in 30 seconds";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          gap: "0px",
        }}
      >
        {/* Logo pill */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "50px",
            padding: "8px 24px",
            color: "white",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ✦ repostly.org
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          Turn YouTube videos into
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#c4b5fd",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          LinkedIn posts that get clicks
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: "26px",
            color: "#ddd6fe",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
            marginBottom: "48px",
          }}
        >
          Paste a URL · Get 5 post styles in 30 seconds · Free to start
        </div>

        {/* CTA pill */}
        <div
          style={{
            background: "white",
            color: "#7c3aed",
            padding: "14px 40px",
            borderRadius: "50px",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          Try it free →
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
