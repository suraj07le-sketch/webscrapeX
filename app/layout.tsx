import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://webscrapex.com'),
  title: {
    default: "WebScrapeX - Premium Website Scraper",
    template: "%s | WebScrapeX"
  },
  description: "Extract assets, metadata, colors, technologies, and design systems from any website with one click. Properties analysis, font detection, and media extraction tool.",
  applicationName: 'WebScrapeX',
  authors: [{ name: 'WebScrapeX Team', url: 'https://webscrapex.com' }],
  generator: 'Next.js',
  keywords: ['web scraper', 'design system extractor', 'website analysis', 'css extractor', 'font detector', 'color palette generator', 'web design tool', 'dev tools'],
  referrer: 'origin-when-cross-origin',
  creator: 'WebScrapeX',
  publisher: 'WebScrapeX',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://webscrapex.com',
    siteName: 'WebScrapeX',
    title: 'WebScrapeX - Premium Website Scraper & Design Extractor',
    description: 'Deconstruct any website\'s design system in seconds. Colors, fonts, assets, and code — extracted and analyzed.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WebScrapeX Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebScrapeX - The Ultimate Web Design Inspector',
    description: 'Extract assets, color palettes, and typography from any website instantly.',
    images: ['/og-image.png'],
    creator: '@webscrapex',
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-300 relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
            <div className="relative">
              <Navbar />
              {children}
            </div>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
