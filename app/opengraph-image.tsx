import { ImageResponse } from "next/og";
import { profile, seo, siteUrl } from "@/lib/content";
import { displayFont } from "@/lib/ogFont";
import { lightTokens } from "@/lib/tokens";

export const alt = seo.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const c = lightTokens(["--bg", "--surface", "--surface-2", "--ink", "--muted", "--line", "--accent", "--accent-ink"] as const);
  const fonts = await displayFont();
  const domain = new URL(siteUrl).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          background: c["--bg"],
          color: c["--ink"],
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            background: c["--surface"],
            border: `2px solid ${c["--line"]}`,
            borderRadius: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                width: 76,
                height: 76,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: c["--accent"],
                color: c["--accent-ink"],
                borderRadius: 20,
                fontFamily: "Bricolage Grotesque",
                fontSize: 38,
                fontWeight: 700,
              }}
            >
              {profile.initials}
            </div>
            <div
              style={{
                marginTop: 32,
                fontFamily: "Bricolage Grotesque",
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              {profile.name}
            </div>
            <div style={{ marginTop: 12, fontSize: 36, color: c["--muted"] }}>{profile.role}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                padding: "20px 28px",
                background: c["--accent"],
                color: c["--accent-ink"],
                borderRadius: 20,
                fontSize: 34,
                fontWeight: 700,
              }}
            >
              {seo.ogTagline}
            </div>
            <div style={{ marginTop: 24, fontSize: 28, color: c["--muted"] }}>{domain}</div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
