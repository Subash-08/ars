import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://arsmotors.in"),
  title: "ARS Motors Salem | Authorized Kinetic Green E-Luna Dealership",
  description:
    "Official authorized dealership for Kinetic Green E-Luna electric mopeds in Salem, Tamil Nadu. Experience the E-Luna PRO X3, Commercial Cargo & City Commuter with interactive 360° view, fuel savings calculator, finance enquiries, and test rides.",
  keywords: [
    "ARS Motors Salem",
    "Kinetic Green E-Luna",
    "E-Luna Salem",
    "Electric Bike Salem",
    "Electric Moped Salem",
    "Seelanaickenpatti EV Showroom",
    "Madathur EV Showroom",
    "Kinetic Luna Electric Tamil Nadu",
    "Commercial Cargo EV Salem",
  ],
  authors: [{ name: "ARS Motors Salem" }],
  creator: "ARS Motors",
  publisher: "ARS Motors",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "ARS Motors Salem | Kinetic Green E-Luna Electric Dealership",
    description: "Explore E-Luna at ARS Motors in Salem. Compare options, request a current quote and arrange a test ride.",
    url: "https://arsmotors.in",
    siteName: "ARS Motors",
    images: [
      {
        url: "/assets/bikes/hero-action-hd.jpg",
        width: 1200,
        height: 630,
        alt: "Kinetic Green E-Luna ARS Motors Salem",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARS Motors Salem | Kinetic Green E-Luna",
    description: "Explore Kinetic Green E-Luna and request a test ride at ARS Motors Salem.",
    images: ["/assets/bikes/hero-action-hd.jpg"],
  },
  alternates: {
    canonical: "https://arsmotors.in",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "ARS Motors - Kinetic Green Authorized Dealership",
    image: "https://arsmotors.in/assets/logo/ars-motors.png",
    telephone: "+91 90253 80626",
    url: "https://arsmotors.in",
    priceRange: "₹64,990 - ₹74,990",
    address: {
      "@type": "PostalAddress",
      streetAddress: "NH 44, Bengaluru-Madurai Highway, Seelanaickenpatti",
      addressLocality: "Salem",
      addressRegion: "Tamil Nadu",
      postalCode: "636201",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "11.6248",
      longitude: "78.1460",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "20:30",
      },
    ],
    brand: {
      "@type": "Brand",
      name: "Kinetic Green",
    },
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Vehicle",
          name: "Kinetic Green E-Luna PRO X3",
          vehicleEngine: "Electric",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Vehicle",
          name: "Kinetic Green E-Luna Commercial Cargo",
          vehicleEngine: "Electric",
        },
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
