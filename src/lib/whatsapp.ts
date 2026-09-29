export const WHATSAPP_NUMBER = "918077988509";

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getProductOrderMessage(product: {
  name: string;
  price: number | string;
  slug: string;
  quantity?: number;
}): string {
  const qty = product.quantity || 1;
  const total = Number(product.price) * qty;
  const url = `https://amroha-pharmacy.vercel.app/products/${product.slug}`;

  return `🛒 *New Order Inquiry*

📦 Product: ${product.name}
💰 Price: ₹${product.price}
🔢 Quantity: ${qty}
💵 Total: ₹${total}

🔗 ${url}

Kya ye available hai? Order karna hai.`;
}

export function getCartOrderMessage(items: {
  name: string;
  price: number;
  quantity: number;
}[]): string {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemLines = items
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.name}\n   ${i.quantity} × ₹${i.price} = ₹${
          i.quantity * i.price
        }`
    )
    .join("\n");

  return `🛒 *New Cart Order*

${itemLines}

💰 *Total: ₹${total}*

Kya ye sab available hai? Order confirm karna hai.`;
}

export function getContactMessage(name?: string): string {
  if (name) {
    return `Hello Amroha Pharmacy, I have a question about: ${name}`;
  }
  return `Hello Amroha Pharmacy, I have a question.`;
}
