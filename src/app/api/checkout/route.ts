import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase";

// Force dynamic rendering — never statically pre-render
export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia",
  });
}

interface CartItemPayload {
  productId: string;
  name: string;
  packType: "retail" | "bulk";
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CheckoutPayload {
  items: CartItemPayload[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutPayload = await req.json();
    const { items, customer, shippingAddress } = body;

    // Validate
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!customer.name || !customer.email) {
      return NextResponse.json({ error: "Customer details required" }, { status: 400 });
    }

    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postcode) {
      return NextResponse.json({ error: "Complete shipping address required" }, { status: 400 });
    }

    const validStates = ["Selangor", "Perak", "Penang", "Kedah"];
    if (!validStates.includes(shippingAddress.state)) {
      return NextResponse.json(
        { error: "Delivery is only available in Selangor, Perak, Penang, and Kedah" },
        { status: 400 }
      );
    }

    // Calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order in Supabase
    const supabase = createServerSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_email: customer.email,
        customer_name: customer.name,
        customer_phone: customer.phone,
        shipping_address: shippingAddress,
        total_amount: totalAmount,
        payment_status: "pending",
        stripe_session_id: null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      pack_type: item.packType,
      price_at_time_of_order: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      // Clean up the order
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 });
    }

    // Create Stripe Checkout Session
    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customer.email,
      line_items: items.map((item) => ({
        price_data: {
          currency: "myr",
          product_data: {
            name: item.name,
            description: `${item.packType === "retail" ? "200g Retail Pack" : "10kg Bulk Pack"}`,
            images: item.imageUrl.startsWith("http")
              ? [item.imageUrl]
              : [`${appUrl}${item.imageUrl}`],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: order.id,
      },
      success_url: `${appUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
    });

    // Update order with Stripe session ID
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
