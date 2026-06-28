"use client";

import { useEffect, useState, useRef } from "react";
import type { Product } from "@/lib/database.types";
import ProductCard from "./ProductCard";

// Fallback products when Supabase is not configured
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Japanese Cucumber",
    description: "Crisp & fresh, grown in the cool Cameron Highlands climate. Special promo deal on bulk purchases!",
    pricing: [{ id: "retail", label: "200g Retail", price: 4.50 }, { id: "promo_10kg", label: "10KG Promo", price: 15.00 }],
    image_url: "/images/japanese-cucumber.png",
    stock_status: "in_stock",
    tag: "Promo",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Cabbage",
    description: "Natural & quality — dense, leafy heads harvested at peak maturity. Grab our promotional bulk pricing!",
    pricing: [{ id: "retail", label: "200g Retail", price: 3.90 }, { id: "promo_10kg", label: "10KG Promo", price: 40.00 }],
    image_url: "/images/cabbage.png",
    stock_status: "in_stock",
    tag: "Promo",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Premium AAA Sweet Corn",
    description: "Exceptionally sweet and juicy farm-fresh premium grade sweet corn.",
    pricing: [{ id: "piece", label: "1 Piece", price: 3.50 }],
    image_url: "/images/combo-box.png",
    stock_status: "in_stock",
    tag: "Premium",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Mega Veggie Wholesale Bundle",
    description: "A massive farm-fresh assortment including: Sawi Cameron, Siew Pak Choy, Spring Onions, Baby Romaine, and White Radish.",
    pricing: [{ id: "bundle", label: "Mega Bundle", price: 100.00 }],
    image_url: "/images/combo-box.png",
    stock_status: "in_stock",
    tag: "Special Deal",
    created_at: new Date().toISOString(),
  }
];

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Dynamic import to avoid issues when env vars aren't set
        const { supabase } = await import("@/lib/supabase");

        if (!supabase) {
          throw new Error("Supabase not configured");
        }

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setProducts((data as unknown as Product[]) || FALLBACK_PRODUCTS);
      } catch {
        // Fallback to static data when Supabase isn't configured
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Intersection observer for reveal animation
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-6");
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = ref.current?.querySelectorAll(".product-wrapper");
    cards?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, products]);

  return (
    <section className="py-20 md:py-28 bg-surface-alt" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label justify-center">Our Produce</span>
          <h2 className="section-heading">Our Featured Produce</h2>
          <p className="section-subtext mx-auto">
            Handpicked, sustainably grown, and delivered fresh — explore our finest Cameron Highlands vegetables.
          </p>
        </div>

        {/* Product Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100">
                  <div className="skeleton h-56 w-full" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-1/2 rounded" />
                    <div className="flex gap-2">
                      <div className="skeleton h-9 flex-1 rounded-lg" />
                      <div className="skeleton h-9 flex-1 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))
            : products.map((product, i) => (
                <div
                  key={product.id}
                  className="product-wrapper opacity-0 translate-y-6 transition-all duration-600"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {/* Packing Notice */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-brand-100 shadow-sm">
            <span className="text-2xl">📦</span>
            <p className="text-sm text-gray-600">
              We offer both <strong className="text-surface-dark">10kg bulk packing</strong> for businesses and
              convenient <strong className="text-surface-dark">200g pre-packs</strong> for retail.
              Contact us for custom packing solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
