"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.15 }
    );

    const els = ref.current?.querySelectorAll(".reveal-item");
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    "Premium highland produce",
    "Sustainable farming methods",
    "Wholesale & retail supply",
    "Own delivery fleet",
  ];

  return (
    <section className="py-20 md:py-28 bg-mesh" id="about" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="reveal-item opacity-0 translate-y-8 transition-all duration-700 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-brand-900/10">
              <Image
                src="/images/hero-farm.png"
                alt="Sunshine Horticulture greenhouse farm"
                width={640}
                height={480}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 md:bottom-6 md:-right-6 bg-white rounded-xl px-4 py-3 shadow-lg border border-brand-100 flex items-center gap-3 float-animation">
              <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-surface-dark">Certified Quality</div>
                <div className="text-xs text-gray-500">Sustainably Grown</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="reveal-item opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: "200ms" }}>
            <span className="section-label">About Us</span>
            <h2 className="section-heading">
              From Our Farm
              <br />
              to Your Table.
            </h2>
            <p className="section-subtext mb-8">
              At Sunshine Horticulture, we are committed to growing a wide variety of safe,
              nutritious, and high-quality vegetables. Grown with care using sustainable farming
              practices, our produce guarantees natural goodness for wholesalers, retailers,
              restaurants, and homes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-surface-dark">{feat}</span>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/60195902156"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              id="about-partner-btn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Partner With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
