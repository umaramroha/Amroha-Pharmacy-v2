import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Call, WhatsApp or email Amroha Pharmacy, Mohalla Nal, Amroha.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
