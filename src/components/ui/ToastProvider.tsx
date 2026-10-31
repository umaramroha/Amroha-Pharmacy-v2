"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";

const ToastContext = createContext<((message: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const nextId = useRef(0);
  const showToast = useCallback((message: string) => {
    setToast({ id: ++nextId.current, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-4 bottom-20 md:bottom-8 z-[80] flex justify-center">
        {toast && (
          <div key={toast.id} className="cart-toast pointer-events-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-xl bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white shadow-2xl">
            <span className="flex items-center gap-2"><svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> {toast.message}</span>
            <Link href="/cart" onClick={() => setToast(null)} className="text-emerald-400 font-bold uppercase text-xs tracking-wider hover:text-emerald-300">View Cart</Link>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
