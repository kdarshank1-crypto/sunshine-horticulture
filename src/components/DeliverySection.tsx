"use client";

import { useEffect, useRef } from "react";

export default function DeliverySection() {
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

  const regions = ["Selangor", "Perak", "Penang", "Kedah"];

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: "Temperature Controlled",
      desc: "Cold-chain logistics preserve freshness",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "On-Time Guarantee",
      desc: "Scheduled deliveries you can count on",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Safe & Secure",
      desc: "Careful handling from farm to destination",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white" id="delivery" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Map Visual */}
          <div className="reveal-item opacity-0 translate-y-8 transition-all duration-700">
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-earth-50 p-8 md:p-10 border border-brand-100/50">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                    <path d="M15 18H9" />
                    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                    <circle cx="17" cy="18" r="2" />
                    <circle cx="7" cy="18" r="2" />
                  </svg>
                </div>
              </div>

              <h3 className="font-heading text-xl font-bold text-surface-dark text-center mb-1.5">
                Sunshine Transport Fleet
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Covering key regions across West Malaysia
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                {regions.map((region) => (
                  <div
                    key={region}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-sm border border-brand-100/50 text-sm font-medium text-surface-dark"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                    {region}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="reveal-item opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: "200ms" }}>
            <span className="section-label">Logistics</span>
            <h2 className="section-heading">
              Delivering Freshness
              <br />
              Across Regions.
            </h2>
            <p className="section-subtext mb-8">
              We operate our own Sunshine Transport fleet to ensure safe, reliable,
              and on-time delivery — from our Cameron Highlands farm straight to your door.
            </p>

            <div className="space-y-5 mb-8">
              {features.map((feat) => (
                <div key={feat.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 text-brand-600">
                    <div className="w-5 h-5">{feat.icon}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-surface-dark">{feat.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/60195902156?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20delivery%20to%20my%20area."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              id="delivery-enquiry-btn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enquire About Delivery
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
