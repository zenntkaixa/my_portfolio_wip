import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import { ANALYTICS_SCRIPT_SRC, analyticsEnabled } from "@/lib/analytics";
import { profile, seo, siteUrl } from "@/lib/content";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// Role only, without the stack list after " · ", so search results don't truncate the title.
const title = `${profile.name} — ${profile.role.split(" · ")[0]}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    firstName: profile.firstName,
    lastName: profile.lastName,
    url: "/",
    siteName: seo.siteName,
    title,
    description: seo.description,
    locale: "en",
  },
  twitter: { card: "summary_large_image", title, description: seo.description },
  authors: [{ name: profile.name, url: siteUrl }],
  robots: { index: true, follow: true },
};

// Sets data-theme before first paint so there is no light/dark flash.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        {children}
        {analyticsEnabled({ VERCEL_ENV: process.env.VERCEL_ENV }) && <script defer src={ANALYTICS_SCRIPT_SRC} />}
      </body>
    </html>
  );
}
