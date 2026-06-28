"use client";

import { useEffect, useState, useRef } from "react";
import type { Product } from "@/lib/database.types";
import ProductCard from "./ProductCard";

// Fallback products when Supabase is not configured
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Japanese Cucumber",
    description: "Crisp & fresh, grown in the cool Cameron Highlands climate for exceptional taste and crunch.",
    price_retail: 4.50,
    price_bulk: 85.00,
    image_url: "/images/japanese-cucumber.png",
    stock_status: "in_stock",
    tag: "Fresh Daily",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Cabbage",
    description: "Natural & quality — dense, leafy heads harvested at peak maturity for wholesalers and retailers.",
    price_retail: 3.90,
    price_bulk: 72.00,
    image_url: "/images/cabbage.png",
    stock_status: "in_stock",
    tag: "Bestseller",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Fresh Tomatoes",
    description: "Carefully grown with natural goodness — vine-ripened for full flavour and vibrant colour.",
    price_retail: 5.20,
    price_bulk: 95.00,
    image_url: "/images/tomatoes.png",
    stock_status: "in_stock",
    tag: "Popular",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Pak Choy & Sawi",
    description: "Fresh daily harvest — tender, nutrient-rich Asian greens perfect for every kitchen.",
    price_retail: 4.00,
    price_bulk: 78.00,
    image_url: "/images/pak-choy-sawi.png",
    stock_status: "in_stock",
    tag: "Daily Harvest",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Premium Combo Box",
    description: "Curated selection of our freshest vegetables — perfect for families, restaurants, and retailers.",
    price_retail: 25.00,
    price_bulk: 180.00,
    image_url: "/images/combo-box.png",
    stock_status: "in_stock",
    tag: "Limited Promo",
    created_at: new Date().toISOString(),
  },
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

    const cards = ref.current?.querySelectorAll(".product-card");
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
                  className="opacity-0 translate-y-6 transition-all duration-600"
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
