import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";
import { displayFont } from "@/lib/ogFont";
import { lightTokens } from "@/lib/tokens";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const c = lightTokens(["--accent", "--accent-ink"] as const);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: c["--accent"],
          color: c["--accent-ink"],
          borderRadius: 8,
          fontFamily: "Bricolage Grotesque",
          fontSize: 17,
          fontWeight: 700,
        }}
      >
        {profile.initials}
      </div>
    ),
    { ...size, fonts: await displayFont() },
  );
}
