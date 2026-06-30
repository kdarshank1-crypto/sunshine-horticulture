"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const WEST_MALAYSIA_STATES = ["Selangor", "Perak", "Penang", "Kedah"];

interface FormData {
  fullName: string;
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
  const { items, subtotal, clearCart } = useCart();
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState<FormData>({
    fullName: "",
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

  // Build WhatsApp message text
  const whatsappMessage = useMemo(() => {
    if (items.length === 0) return "";

    const itemLines = items.map(
      (item) =>
        `• ${item.name} (${item.packLabel}) × ${item.quantity} — RM ${(item.price * item.quantity).toFixed(2)}`
    );

    const addressParts = [
      form.addressLine1,
      form.addressLine2,
      form.city && form.state && form.postcode
        ? `${form.city}, ${form.state} ${form.postcode}`
        : "",
    ].filter(Boolean);

    return [
      `🛒 *New Order from Sunshine Horticulture Website*`,
      ``,
      `👤 *Customer:* ${form.fullName}`,
      `📞 *Phone:* ${form.phone}`,
      ``,
      `📦 *Order Items:*`,
      ...itemLines,
      ``,
      `💰 *Subtotal:* RM ${subtotal.toFixed(2)}`,
      ``,
      `📍 *Delivery Address:*`,
      ...addressParts,
    ].join("\n");
  }, [items, form, subtotal]);

  // WhatsApp URL
  const whatsappUrl = useMemo(() => {
    return `https://wa.me/60195902156?text=${encodeURIComponent(whatsappMessage)}`;
  }, [whatsappMessage]);

  const handleShowPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;
    setShowPreview(true);
    // Scroll to top so user sees the preview
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSendWhatsApp = () => {
    clearCart();
    // Direct navigation — no popup blocker issues
    window.location.href = whatsappUrl;
  };

  // ─── PREVIEW SCREEN ───
  if (showPreview) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <main className="min-h-screen bg-surface-alt pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
              <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
              <span>/</span>
              <button onClick={() => setShowPreview(false)} className="hover:text-brand-600 transition-colors cursor-pointer">Checkout</button>
              <span>/</span>
              <span className="text-surface-dark font-medium">Preview</span>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 animate-scale-in">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-surface-dark">
                    Message Preview
                  </h1>
                  <p className="text-sm text-gray-500">
                    Review your order before sending via WhatsApp
                  </p>
                </div>
              </div>

              {/* Message Preview Box — styled like a WhatsApp chat bubble */}
              <div className="bg-[#e7fdd8] rounded-2xl rounded-tr-sm p-5 mb-6 border border-[#d4f5c0] shadow-sm">
                <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed font-[system-ui]">
                  {whatsappMessage}
                </div>
              </div>

              {/* Order summary card */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-surface-dark">Order Summary</span>
                  <span className="text-sm font-bold text-brand-700">RM {subtotal.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.packType}`} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 bg-gray-200">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-gray-600 flex-1 truncate">
                        {item.name} ({item.packLabel}) × {item.quantity}
                      </span>
                      <span className="text-xs font-semibold text-gray-700">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                <span className="text-sm font-semibold text-surface-dark block mb-2">Delivering To</span>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {form.fullName}<br />
                  {form.phone}<br />
                  {form.addressLine1}
                  {form.addressLine2 && <><br />{form.addressLine2}</>}
                  <br />
                  {form.city}, {form.state} {form.postcode}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="btn-outline flex-1 justify-center"
                  id="back-to-form-btn"
                >
                  ← Edit Details
                </button>
                <button
                  onClick={handleSendWhatsApp}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base text-white bg-[#25D366] hover:bg-[#1fb855] shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-200 cursor-pointer"
                  id="confirm-whatsapp-btn"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send via WhatsApp
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Clicking &quot;Send via WhatsApp&quot; will open WhatsApp with this message pre-filled. You can review it one more time before hitting send.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ─── FORM SCREEN ───
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
                  Delivery Details
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  Fill in your details and we&apos;ll prepare your order message for WhatsApp.
                </p>

                {/* WhatsApp Info Banner */}
                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <div>
                    <strong>Order via WhatsApp</strong> — You&apos;ll see a message preview before sending. Your order and delivery details go directly to our team.
                  </div>
                </div>

                <form onSubmit={handleShowPreview} className="space-y-5" id="checkout-form">
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

                  {/* Phone */}
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

                  {/* Submit — goes to preview, not WhatsApp */}
                  <button
                    type="submit"
                    disabled={items.length === 0}
                    className={`btn-primary w-full justify-center !py-4 !text-base mt-4 ${
                      items.length === 0 ? "!bg-gray-300 !shadow-none cursor-not-allowed" : ""
                    }`}
                    id="preview-order-btn"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview Order Message
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
                              {item.packLabel} × {item.quantity}
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
                        <span className="text-brand-600 font-medium">To be confirmed</span>
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

                {/* WhatsApp badge */}
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order sent directly via WhatsApp. Payment arranged with our team.
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
