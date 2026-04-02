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

export const viewport = {
  themeColor: "#5fc8f1",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://testimonial-hub-five.vercel.app/"),

  title: {
    default: "Testimonial Hub - Premium Portfolio & Feedback Manager",
    template: "%s | Testimonial Hub",
  },

  description:
    "The premium platform for capturing, organizing, and displaying client testimonials and portfolios.",

  applicationName: "Testimonial Hub",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/Dots.ico",
  },

  openGraph: {
    title: "Testimonial Hub | Real Customer Reviews & Testimonials",
    description:
      "Explore authentic testimonials and share your experiences with our growing community.",
    url: "https://testimonial-hub-five.vercel.app/",
    siteName: "Testimonial Hub",
    images: [
      {
        url: "/Testimonial.png",
        width: 1200,
        height: 630,
        alt: "Testimonial Hub",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Testimonial Hub",
    description:
      "Discover and share authentic testimonials from real users.",
    images: ["/Testimonial.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${manrope.variable}
          antialiased
        `}
      >
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y3KJ1YVCSE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y3KJ1YVCSE');
          `}
        </Script>

        <Analytics />

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
