import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Blog",
  description: "Articles on Ayurvedic and Unani care from Amroha Pharmacy.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
