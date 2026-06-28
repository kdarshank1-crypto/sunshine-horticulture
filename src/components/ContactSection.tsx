"use client";

import { useState, useRef, useEffect } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
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
      { threshold: 0.1 }
    );

    const els = ref.current?.querySelectorAll(".reveal-item");
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-20 md:py-28 bg-surface-dark" id="contact" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Info */}
          <div className="reveal-item opacity-0 translate-y-8 transition-all duration-700">
            <span className="section-label !text-brand-400 before:!bg-brand-400">Contact</span>
            <h2 className="section-heading !text-white">Get in Touch.</h2>
            <p className="section-subtext !text-gray-400 mb-10">
              Ready to order premium fresh vegetables? Reach out to us today — we&apos;d love to hear from you.
            </p>

            <div className="space-y-5">
              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <a href="tel:+60126320259" className="text-white/80 hover:text-brand-400 transition-colors text-sm">
                  012-632 0259
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <a href="mailto:jabiruagriculture@gmail.com" className="text-white/80 hover:text-brand-400 transition-colors text-sm break-all">
                  jabiruagriculture@gmail.com
                </a>
              </div>

              {/* Address */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-400">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Cameron Highlands, Pahang, Malaysia</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-8">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:text-brand-400 hover:bg-white/20 transition-all"
                aria-label="Instagram"
                id="social-instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://wa.me/60126320259"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 hover:text-brand-400 hover:bg-white/20 transition-all"
                aria-label="WhatsApp"
                id="social-whatsapp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal-item opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: "200ms" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10" id="contact-form">
                <h3 className="font-heading text-xl font-bold text-white mb-6">Send Us a Message</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="form-name" className="form-label !text-white/70">Your Name</label>
                    <input type="text" id="form-name" name="name" placeholder="e.g. Ahmad bin Ibrahim" required className="form-input !bg-white/10 !border-white/20 !text-white placeholder:!text-white/30 focus:!border-brand-400" />
                  </div>
                  <div>
                    <label htmlFor="form-email" className="form-label !text-white/70">Email Address</label>
                    <input type="email" id="form-email" name="email" placeholder="e.g. ahmad@example.com" required className="form-input !bg-white/10 !border-white/20 !text-white placeholder:!text-white/30 focus:!border-brand-400" />
                  </div>
                  <div>
                    <label htmlFor="form-message" className="form-label !text-white/70">Your Message</label>
                    <textarea id="form-message" name="message" placeholder="Tell us about your order requirements..." required rows={4} className="form-input !bg-white/10 !border-white/20 !text-white placeholder:!text-white/30 focus:!border-brand-400 resize-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button type="submit" className="btn-primary flex-1 justify-center" id="form-submit-btn">
                    Send Message
                  </button>
                  <a
                    href="https://wa.me/60126320259"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline !border-white/20 !text-brand-400 flex-1 justify-center"
                    id="footer-wa-btn"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </form>
            ) : (
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-10 border border-white/10 flex flex-col items-center justify-center text-center animate-scale-in min-h-[380px]">
                <div className="w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h4 className="font-heading text-xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-sm text-gray-400">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
