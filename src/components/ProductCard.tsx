"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product, PackType } from "@/lib/database.types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [packType, setPackType] = useState<PackType>("retail");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const price = packType === "retail" ? product.price_retail : product.price_bulk;
  const packLabel = packType === "retail" ? "200g Retail" : "10kg Bulk";
  const isOutOfStock = product.stock_status === "out_of_stock";

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      name: product.name,
      packType,
      price,
      quantity,
      imageUrl: product.image_url || "/images/combo-box.png",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setQuantity(1);
  };

  return (
    <div className="product-card group" id={`product-${product.id}`}>
      {/* Image */}
      <div className="card-image">
        <Image
          src={product.image_url || "/images/combo-box.png"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.tag && <span className="card-tag">{product.tag}</span>}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-surface-dark mb-1.5">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Pack Type Toggle */}
        <div className="flex gap-2 mb-4">
          {(["retail", "bulk"] as PackType[]).map((type) => (
            <button
              key={type}
              onClick={() => setPackType(type)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                packType === type
                  ? "bg-brand-50 border-brand-300 text-brand-700"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {type === "retail" ? "200g Retail" : "10kg Bulk"}
            </button>
          ))}
        </div>

        {/* Price + Quantity + Add */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-bold text-brand-700 font-heading">
              RM {price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">{packLabel}</div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
                disabled={isOutOfStock}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold text-surface-dark">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
                disabled={isOutOfStock}
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                added
                  ? "bg-brand-500 text-white scale-95"
                  : isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-brand-600 text-white hover:bg-brand-500 hover:shadow-md active:scale-95"
              }`}
              id={`add-cart-${product.id}`}
            >
              {added ? "✓ Added" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
