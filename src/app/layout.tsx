import type { Metadata } from "next";
import { Outfit, Lora } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
import { ServiceWorkerCleaner } from "@/components/ServiceWorkerCleaner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "BuzzThrills Prime — Never Forget Any Special Day Again",
  description: "Surprise calls, emotional messages, and corporate engagement. Never forget any special moment again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${lora.variable} scroll-smooth`} suppressHydrationWarning>
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
