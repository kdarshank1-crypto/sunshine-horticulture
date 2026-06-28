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

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("No orderId in session metadata");
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Update order payment status to 'paid'
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "paid" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    // Fetch the complete order with items for email
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    // Trigger email notifications
    if (order && orderItems) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        await fetch(`${appUrl}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order, orderItems }),
        });
      } catch (emailError) {
        // Log but don't fail the webhook
        console.error("Email notification error:", emailError);
      }
    }

    console.log(`✅ Order ${orderId} paid successfully`);
  }

  return NextResponse.json({ received: true });
}
