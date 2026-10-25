type TrustIconName = "shield" | "truck" | "cash" | "support";

export default function TrustIcon({ name, className = "h-6 w-6" }: { name: TrustIconName; className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      {name === "shield" && <><path d="m12 3 8 3v6c0 4-5 8-8 9-3-1-8-5-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/></>}
      {name === "truck" && <><path d="M3 5h11v12H3V5Zm11 4h4l3 4v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M3 9h5"/></>}
      {name === "cash" && <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/></>}
      {name === "support" && <><path d="M4 13v-1a8 8 0 0 1 16 0v1M4 12H3v6h4v-6H4Zm16 0h1v6h-4v-6h3Zm0 6v1a2 2 0 0 1-2 2h-6"/></>}
    </svg>
  );
}
