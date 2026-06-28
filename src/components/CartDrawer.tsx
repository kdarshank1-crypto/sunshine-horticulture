"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h2 className="font-heading text-lg font-bold text-surface-dark">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h3 className="font-heading text-base font-bold text-gray-400 mb-1">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-400">
                Add some fresh produce to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.packType}`}
                  className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 animate-scale-in"
                >
                  {/* Item Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-surface-dark truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs text-gray-400 capitalize">
                          {item.packLabel}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.packType)}
                        className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.packType, item.quantity - 1)}
                          className="qty-btn !w-7 !h-7 text-xs"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-surface-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.packType, item.quantity + 1)}
                          className="qty-btn !w-7 !h-7 text-xs"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand-700">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-xl font-bold text-surface-dark font-heading">
                RM {subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout.</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center !py-3.5 !text-base"
              id="checkout-btn"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
