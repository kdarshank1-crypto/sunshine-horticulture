"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const WEST_MALAYSIA_STATES = ["Selangor", "Perak", "Penang", "Kedah"];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postcode: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postcode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-+()]{8,15}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "Please select a state";
    if (!form.postcode.trim()) {
      newErrors.postcode = "Postcode is required";
    } else if (!/^\d{5}$/.test(form.postcode)) {
      newErrors.postcode = "Malaysian postcode must be 5 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            packType: item.packType,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
          customer: {
            name: form.fullName,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            line1: form.addressLine1,
            line2: form.addressLine2,
            city: form.city,
            state: form.state,
            postcode: form.postcode,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen bg-surface-alt pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-surface-dark font-medium">Checkout</span>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Shipping Form — 3 cols */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h1 className="font-heading text-2xl font-bold text-surface-dark mb-1">
                  Shipping Details
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  Delivery available across West Malaysia — Selangor, Perak, Penang & Kedah.
                </p>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" id="checkout-form">
                  {/* Name */}
                  <div>
                    <label htmlFor="fullName" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ahmad bin Ibrahim"
                      className={`form-input ${errors.fullName ? "!border-red-400 !ring-red-100" : ""}`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. ahmad@example.com"
                        className={`form-input ${errors.email ? "!border-red-400" : ""}`}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 012-345 6789"
                        className={`form-input ${errors.phone ? "!border-red-400" : ""}`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="addressLine1" className="form-label">Address Line 1 *</label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleChange}
                      placeholder="Street address, P.O. box"
                      className={`form-input ${errors.addressLine1 ? "!border-red-400" : ""}`}
                    />
                    {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div>
                    <label htmlFor="addressLine2" className="form-label">Address Line 2</label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleChange}
                      placeholder="Apartment, suite, unit, building (optional)"
                      className="form-input"
                    />
                  </div>

                  {/* City + State + Postcode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="form-label">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Petaling Jaya"
                        className={`form-input ${errors.city ? "!border-red-400" : ""}`}
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="state" className="form-label">State *</label>
                      <select
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className={`form-input ${errors.state ? "!border-red-400" : ""} ${!form.state ? "text-gray-400" : ""}`}
                      >
                        <option value="">Select state</option>
                        {WEST_MALAYSIA_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label htmlFor="postcode" className="form-label">Postcode *</label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={form.postcode}
                        onChange={handleChange}
                        placeholder="e.g. 47800"
                        maxLength={5}
                        className={`form-input ${errors.postcode ? "!border-red-400" : ""}`}
                      />
                      {errors.postcode && <p className="text-xs text-red-500 mt-1">{errors.postcode}</p>}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className={`btn-primary w-full justify-center !py-4 !text-base mt-4 ${
                      loading ? "opacity-70 cursor-wait" : ""
                    } ${items.length === 0 ? "!bg-gray-300 !shadow-none cursor-not-allowed" : ""}`}
                    id="pay-stripe-btn"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Pay RM {subtotal.toFixed(2)} with Stripe
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary — 2 cols */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="font-heading text-lg font-bold text-surface-dark mb-5">
                  Order Summary
                </h2>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400">Your cart is empty</p>
                    <Link href="/#products" className="text-sm text-brand-600 hover:underline mt-2 inline-block">
                      Browse products →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {items.map((item) => (
                        <div key={`${item.productId}-${item.packType}`} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-dark truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">
                              {item.packType === "retail" ? "200g" : "10kg"} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-surface-dark shrink-0">
                            RM {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-surface-dark">RM {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-brand-600 font-medium">Calculated at payment</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-100">
                        <span className="font-heading font-bold text-surface-dark">Total</span>
                        <span className="font-heading text-xl font-bold text-brand-700">
                          RM {subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Security badge */}
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Secured by Stripe. Your payment information is encrypted.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
