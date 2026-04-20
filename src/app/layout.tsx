import type { Metadata } from "next";
import { Outfit, Lora } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
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
      <body className="antialiased bg-background text-foreground transition-colors duration-500">
        {/* Unregister any stale service workers — prevents workbox from blocking navigation */}
        <Script id="sw-unregister" strategy="beforeInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for (var i = 0; i < registrations.length; i++) {
                registrations[i].unregister();
              }
            });
          }
        `}</Script>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            enableColorScheme={false}
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
