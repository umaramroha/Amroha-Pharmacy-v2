import { ReactNode } from "react";
type Props = { params: Promise<{ slug: string }>; children: ReactNode; };
export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}