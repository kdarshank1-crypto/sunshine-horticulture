"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          id="nav-brand"
        >
          <svg
            className={`w-8 h-8 transition-colors duration-300 ${
              scrolled ? "text-brand-600" : "text-brand-400"
            }`}
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M16 2C16 2 6 10 6 20C6 25.5 10.5 30 16 30C21.5 30 26 25.5 26 20C26 10 16 2 16 2Z"
              fill="currentColor"
              opacity=".8"
            />
            <path d="M16 10V26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 16C13 14 11 12 10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 20C19 18 21 16 22 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span
            className={`font-heading text-lg font-bold transition-colors duration-300 ${
              scrolled ? "text-surface-dark" : "text-white"
            }`}
          >
            Sunshine Horticulture
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "About", href: "#about" },
            { label: "Products", href: "#products" },
            { label: "Delivery", href: "#delivery" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-brand-500 ${
                scrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className={`relative p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              scrolled
                ? "text-gray-600 hover:bg-brand-50 hover:text-brand-600"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            aria-label="Shopping Cart"
            id="cart-btn"
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
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center animate-scale-in">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/checkout"
            className="btn-primary text-sm !px-5 !py-2.5"
            id="nav-order-btn"
          >
            Order Now
          </Link>
        </div>

        {/* Mobile: Cart + Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleCart}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              scrolled ? "text-gray-600" : "text-white/80"
            }`}
            aria-label="Shopping Cart"
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
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex flex-col gap-1.5 p-2 cursor-pointer ${
              scrolled ? "text-gray-700" : "text-white"
            }`}
            aria-label="Toggle navigation"
            id="nav-toggle"
          >
            <span
              className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[4px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 rounded-full bg-current transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-0 z-50 transition-all duration-300 ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 pt-20 flex flex-col gap-4">
            {[
              { label: "About", href: "#about" },
              { label: "Products", href: "#products" },
              { label: "Delivery", href: "#delivery" },
              { label: "Contact", href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-brand-600 py-2 border-b border-gray-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/checkout"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-4 text-center"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
