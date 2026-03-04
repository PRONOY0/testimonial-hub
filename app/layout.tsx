import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Testimonial Hub",
  description: "A platform to share and discover testimonials.",
  openGraph: {
    title: "Testimonial Hub",
    description: "A platform to share and discover testimonials.",
    images: [],
  },
  twitter: {
    card: "summary"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script src ="https://www.googletagmanager.com/gtag/js?id=G-Y3KJ1YVCSE" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y3KJ1YVCSE');
          `}
        </Script>
      </head>
      <body
        className={`
          ${manrope.variable}
          antialiased
        `}
      >
        <Analytics />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
      </head>
    </html>
  );
}
