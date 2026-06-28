import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jabiru Agriculture — Premium Fresh Vegetables from Cameron Highlands",
  description:
    "Jabiru Agriculture — premium, sustainably grown vegetables direct from Cameron Highlands, Pahang. Wholesale and retail fresh produce with reliable delivery across West Malaysia.",
  keywords:
    "fresh vegetables, Cameron Highlands, wholesale vegetables, premium produce, sustainable farming, Malaysia, Pahang, Jabiru Agriculture",
  authors: [{ name: "Jabiru Agriculture Sdn Bhd" }],
  openGraph: {
    title: "Jabiru Agriculture — Premium Fresh Vegetables",
    description:
      "Sustainably grown vegetables direct from the cool highlands of Cameron to your business and home.",
    type: "website",
    images: ["/images/hero-farm.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
