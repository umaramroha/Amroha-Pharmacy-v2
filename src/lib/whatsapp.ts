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
  const url = `https://amrohapharmacy.vercel.app/products/${product.slug}`;

  return `Order Inquiry - Amroha Pharmacy

Product: ${product.name}
Price: Rs. ${product.price}
Quantity: ${qty}
Total: Rs. ${total}

Product Link: ${url}

Please confirm availability and order details.`;
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
        `${idx + 1}. ${i.name}
   ${i.quantity} x Rs. ${i.price} = Rs. ${i.quantity * i.price}`
    )
    .join("\n");

  return `Order Inquiry - Amroha Pharmacy

${itemLines}

Total: Rs. ${total}

Please confirm availability and proceed with my order.`;
}

export function getContactMessage(name?: string): string {
  if (name) {
    return `Hello Amroha Pharmacy, I have a question about: ${name}`;
  }
  return `Hello Amroha Pharmacy, I would like to inquire about your products.`;
}
