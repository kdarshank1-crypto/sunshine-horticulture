import type { Order, OrderItem } from "./database.types";

/**
 * Generate a professional HTML email receipt for the customer.
 */
export function generateCustomerReceiptHTML(
  order: Order,
  orderItems: OrderItem[]
): string {
  const address = order.shipping_address;
  const itemsRows = orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">
          ${item.quantity}×
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">
          Product #${item.product_id.slice(0, 8)}
          <br/><span style="color: #888; font-size: 12px;">${item.pack_label}</span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333; text-align: right;">
          RM ${(item.price_at_time_of_order * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background-color: #f5f7f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🌿 Jabiru Agriculture</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Cameron Highlands, Pahang</p>
            </td>
          </tr>

          <!-- Thank you -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 8px; color: #166534; font-size: 20px;">Thank you for your order!</h2>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                Hi ${order.customer_name}, we've received your order and our team is preparing your fresh produce. 
                You'll receive updates as your order progresses.
              </p>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e8ede9; border-radius: 12px; overflow: hidden;">
                <tr style="background: #f8faf9;">
                  <th style="padding: 10px 16px; font-size: 12px; color: #888; text-align: left; font-weight: 600;">QTY</th>
                  <th style="padding: 10px 16px; font-size: 12px; color: #888; text-align: left; font-weight: 600;">ITEM</th>
                  <th style="padding: 10px 16px; font-size: 12px; color: #888; text-align: right; font-weight: 600;">AMOUNT</th>
                </tr>
                ${itemsRows}
                <tr style="background: #f8faf9;">
                  <td colspan="2" style="padding: 14px 16px; font-size: 14px; font-weight: 700; color: #333;">Total</td>
                  <td style="padding: 14px 16px; font-size: 16px; font-weight: 700; color: #16a34a; text-align: right;">RM ${order.total_amount.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping -->
          <tr>
            <td style="padding: 24px 32px;">
              <h3 style="margin: 0 0 8px; color: #333; font-size: 14px; font-weight: 600;">Shipping To:</h3>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                ${order.customer_name}<br/>
                ${address.line1}${address.line2 ? "<br/>" + address.line2 : ""}<br/>
                ${address.city}, ${address.state} ${address.postcode}<br/>
                Malaysia
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #f0f0f0; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Need help? WhatsApp us at <a href="https://wa.me/60126320259" style="color: #16a34a; text-decoration: none;">012-632 0259</a>
              </p>
              <p style="margin: 8px 0 0; color: #ccc; font-size: 11px;">
                © ${new Date().getFullYear()} Jabiru Agriculture Sdn Bhd. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generate an HTML email alert for the admin about a new order.
 */
export function generateAdminAlertHTML(
  order: Order,
  orderItems: OrderItem[]
): string {
  const address = order.shipping_address;
  const itemsList = orderItems
    .map(
      (item) =>
        `<li style="padding: 6px 0; font-size: 14px; color: #333; border-bottom: 1px solid #f0f0f0;">
          <strong>${item.quantity}×</strong> Product #${item.product_id.slice(0, 8)} 
          (${item.pack_label}) — 
          RM ${(item.price_at_time_of_order * item.quantity).toFixed(2)}
        </li>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: #1e293b; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 18px;">🔔 New Order Received</h1>
              <p style="margin: 4px 0 0; color: rgba(255,255,255,0.6); font-size: 13px;">Jabiru Agriculture — Order Fulfillment</p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #888; width: 120px;">Order ID:</td>
                  <td style="padding: 8px 0; font-size: 13px; color: #333; font-weight: 600;">${order.id.slice(0, 12)}...</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #888;">Customer:</td>
                  <td style="padding: 8px 0; font-size: 13px; color: #333;">${order.customer_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #888;">Email:</td>
                  <td style="padding: 8px 0; font-size: 13px; color: #333;"><a href="mailto:${order.customer_email}" style="color: #16a34a;">${order.customer_email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #888;">Phone:</td>
                  <td style="padding: 8px 0; font-size: 13px; color: #333;">${order.customer_phone || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #888;">Total:</td>
                  <td style="padding: 8px 0; font-size: 16px; color: #16a34a; font-weight: 700;">RM ${order.total_amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #888;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; background: #dcfce7; color: #166534;">
                      PAID
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 0 32px 16px;">
              <h3 style="margin: 0 0 8px; font-size: 14px; color: #333;">Order Items:</h3>
              <ul style="margin: 0; padding: 0; list-style: none;">${itemsList}</ul>
            </td>
          </tr>

          <!-- Shipping -->
          <tr>
            <td style="padding: 16px 32px 24px;">
              <h3 style="margin: 0 0 8px; font-size: 14px; color: #333;">Ship To:</h3>
              <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.6;">
                ${address.line1}${address.line2 ? ", " + address.line2 : ""}<br/>
                ${address.city}, ${address.state} ${address.postcode}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px; border-top: 1px solid #f0f0f0; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 11px;">
                This is an automated notification from Jabiru Agriculture.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
