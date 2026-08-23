import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
import { ServiceWorkerCleaner } from "@/components/ServiceWorkerCleaner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});


const SITE_TITLE = "BuzzThrills - Best Surprise Call Agency In Nigeria";
const SITE_DESCRIPTION = "From birthdays and anniversaries to apologies, appreciation, encouragement and “just because” moments, we turn what you feel into personalized surprise calls, scannable audio/visual letters and memorable experiences designed to make every recipient feel truly special.";

export const metadata: Metadata = {
  metadataBase: new URL("https://buzzthrills.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://buzzthrills.com",
    siteName: "BuzzThrills",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body 
        className="antialiased bg-background text-foreground transition-colors duration-500"
        suppressHydrationWarning
      >
        <ServiceWorkerCleaner />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          enableColorScheme={false}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
