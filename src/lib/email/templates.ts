type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderConfirmationData = {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string;
  paymentMethod: string;
};

export function getOrderConfirmationHTML(data: OrderConfirmationData): string {
  const {
    customerName,
    orderId,
    items,
    subtotal,
    deliveryFee,
    total,
    address,
    paymentMethod,
  } = data;

  const shortId = orderId.slice(-8).toUpperCase();

  const itemsHTML = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #4b5563;">
          ${item.name} × ${item.quantity}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1f2937; font-weight: bold; text-align: right;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmed</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        
        <div style="background-color: #0F766E; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Order Confirmed!</h1>
        </div>

        <div style="padding: 30px 25px;">
          <p style="font-size: 16px; color: #1f2937;">Namaste <strong>${customerName}</strong>,</p>

          <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
            Aapka order successfully place ho gaya hai. Hum jald hi aapke order ko dispatch karenge aur tracking details WhatsApp pe bhej denge.
          </p>

          <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #0F766E;">
            <p style="margin: 0; font-size: 13px; color: #4b5563;">Order ID</p>
            <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #0F766E; font-family: monospace;">
              #${shortId}
            </p>
          </div>

          <h2 style="font-size: 16px; color: #1f2937; margin-top: 30px; margin-bottom: 15px;">
            Order Items
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHTML}
          </table>

          <table style="width: 100%; margin-top: 20px;">
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #4b5563;">Subtotal</td>
              <td style="padding: 5px 0; font-size: 14px; color: #4b5563; text-align: right;">₹${subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 14px; color: #4b5563;">Delivery Fee</td>
              <td style="padding: 5px 0; font-size: 14px; color: #4b5563; text-align: right;">
                ${deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toLocaleString("en-IN")}`}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #0F766E; border-top: 2px solid #0F766E;">
                Total
              </td>
              <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #0F766E; border-top: 2px solid #0F766E; text-align: right;">
                ₹${total.toLocaleString("en-IN")}
              </td>
            </tr>
          </table>

          <h2 style="font-size: 16px; color: #1f2937; margin-top: 30px; margin-bottom: 10px;">
            Delivery Address
          </h2>
          <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0;">
            ${address}
          </p>

          <p style="font-size: 14px; color: #4b5563; margin-top: 20px;">
            <strong>Payment Method:</strong> ${paymentMethod === "cod" ? "Cash on Delivery" : "UPI Payment"}
          </p>
        </div>

        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 0 0 10px;">
            Koi sawaal? WhatsApp karein:
            <a href="https://wa.me/918077988509" style="color: #0F766E; text-decoration: none;">
              +91 80779 88509
            </a>
          </p>
          <p style="margin: 0;">
            © ${new Date().getFullYear()} Amroha Pharmacy. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getAdminOrderNotificationHTML(data: {
  customerName: string;
  customerMobile: string;
  total: number;
  paymentMethod: string;
  address: string;
  orderId: string;
}): string {
  const shortId = data.orderId.slice(-8).toUpperCase();

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 25px; border-radius: 12px;">
        <h2 style="color: #0F766E; margin-top: 0;">🔔 New Order Received</h2>
        <p><strong>Order ID:</strong> #${shortId}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Mobile:</strong> ${data.customerMobile}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Total:</strong> ₹${data.total.toLocaleString("en-IN")}</p>
        <p><strong>Payment:</strong> ${data.paymentMethod === "cod" ? "COD" : "UPI"}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
        <a href="https://amrohapharmastore.vercel.app/admin/orders" style="display: inline-block; background-color: #0F766E; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          View in Admin Panel →
        </a>
      </div>
    </div>
  `;
}
