import type { MetadataRoute } from "next";
import { getDb } from "@/lib/store";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const db = getDb();
  const staticRoutes = ["/", "/projects", "/blog", "/contact"];
  const projectRoutes = db.projects
    .filter((p) => p.status === "published")
    .map((p) => `/projects/${p.slug}`);
  const blogRoutes = db.blogPosts
    .filter((p) => p.status === "published")
    .map((p) => `/blog/${p.slug}`);
  const now = new Date();

  return [...staticRoutes, ...projectRoutes, ...blogRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
