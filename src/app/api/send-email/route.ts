import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/email";
import { generateCustomerReceiptHTML, generateAdminAlertHTML } from "@/lib/email-templates";
import type { Order, OrderItem } from "@/lib/database.types";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface EmailPayload {
  order: Order;
  orderItems: OrderItem[];
}

export async function POST(req: NextRequest) {
  try {
    const { order, orderItems }: EmailPayload = await req.json();

    if (!order || !orderItems) {
      return NextResponse.json({ error: "Missing order data" }, { status: 400 });
    }

    if (!resend) {
      console.warn("⚠️ Resend not configured. Skipping email notifications.");
      console.log("Order details for manual follow-up:", {
        orderId: order.id,
        customer: order.customer_name,
        email: order.customer_email,
        total: order.total_amount,
      });
      return NextResponse.json({ message: "Emails skipped — Resend not configured" });
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@sunshinehorticulture.com";

    // Send customer receipt
    const customerEmailResult = await resend.emails.send({
      from: "Sunshine Horticulture <orders@sunshinehorticulture.com>",
      to: order.customer_email,
      subject: `Order Confirmed — Sunshine Horticulture #${order.id.slice(0, 8)}`,
      html: generateCustomerReceiptHTML(order, orderItems),
    });

    // Send admin alert
    const adminEmailResult = await resend.emails.send({
      from: "Sunshine Orders <orders@sunshinehorticulture.com>",
      to: adminEmail,
      subject: `🔔 New Order: RM ${order.total_amount.toFixed(2)} from ${order.customer_name}`,
      html: generateAdminAlertHTML(order, orderItems),
    });

    console.log("✅ Emails sent:", {
      customer: customerEmailResult,
      admin: adminEmailResult,
    });

    return NextResponse.json({
      message: "Emails sent successfully",
      customer: customerEmailResult,
      admin: adminEmailResult,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
