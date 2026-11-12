import type { Metadata, Viewport } from "next";
import { Manrope, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { HydrationMarker } from "@/components/hydration-marker";
import { PageIntro } from "@/components/page-intro";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Marcus Mallari — Business Informatics Student & Web Developer",
    template: "%s — Marcus Mallari",
  },
  description:
    "Portfolio of Marcus Mallari, fourth-year Business Informatics (BSIT-BAM) student at PHINMA Araullo University and aspiring web developer. Selected projects, skills, experience, and contact.",
  keywords: [
    "Marcus Mallari",
    "Business Informatics",
    "web developer",
    "portfolio",
    "PHINMA Araullo University",
    "Nueva Ecija",
    "project management",
  ],
  authors: [{ name: "Marcus Mallari" }],
  openGraph: {
    title: "Marcus Mallari — Building digital solutions with purpose.",
    description:
      "Business Informatics student and aspiring web developer. Systems I designed and developed: smart scheduling, e-commerce, and payroll.",
    type: "website",
    locale: "en_US",
    siteName: "Marcus Mallari Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcus Mallari — Business Informatics Student & Web Developer",
    description: "Building digital solutions with purpose.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F3F0E8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSerif.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute("data-js","")`,
          }}
        />
        <HydrationMarker />
        <PageIntro />
        {children}
      </body>
    </html>
  );
}
