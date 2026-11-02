import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  return (
    <a href={getWhatsAppLink("Hello Amroha Pharmacy, I need help choosing a product.")} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="md:hidden fixed right-4 bottom-[80px] z-50 w-14 h-14 bg-green-700 rounded-full flex items-center justify-center shadow-lg pulse-ring">
      <MessageCircle className="w-7 h-7 text-white" />
    </a>
  );
}