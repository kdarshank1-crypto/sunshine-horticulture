"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-6");
          }
        });
      },
      { threshold: 0.2 }
    );

    const els = statsRef.current?.querySelectorAll(".hero-stat");
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-farm.png"
          alt="Lush green vegetable greenhouse at Cameron Highlands"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-soft" />
          <span className="text-sm text-white/90 font-medium">
            Cameron Highlands, Pahang
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-3xl leading-[1.08] animate-slide-up">
          Cultivating Quality,
          <br />
          Delivering{" "}
          <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
            Freshness.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          Premium, sustainably grown vegetables direct from the cool highlands
          of Cameron to your business and home.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="#products"
            className="btn-primary !px-8 !py-4 !text-base"
            id="hero-order-btn"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Order Fresh Produce
          </a>
          <Link
            href="#about"
            className="btn-outline !border-white/30 !text-white hover:!bg-white/10 !px-8 !py-4 !text-base"
            id="hero-explore-btn"
          >
            Explore Our Farm
          </Link>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="flex flex-wrap gap-8 sm:gap-12">
          {[
            { value: "15+", label: "Years of Farming", id: "stat-years" },
            { value: "20+", label: "Crop Varieties", id: "stat-products" },
            { value: "500+", label: "Happy Clients", id: "stat-clients" },
          ].map((stat, i) => (
            <div
              key={stat.id}
              id={stat.id}
              className="hero-stat opacity-0 translate-y-6 transition-all duration-700"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-white font-heading">
                {stat.value}
              </div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-[2]" />
    </section>
  );
}
