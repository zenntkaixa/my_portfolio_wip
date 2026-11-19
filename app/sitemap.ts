import type { MetadataRoute } from "next";
import { profile, siteUrl } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl }, { url: `${siteUrl}${profile.cv.href}` }];
}
