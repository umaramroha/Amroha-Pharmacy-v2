"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

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
      <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-[80] flex justify-center">
        {toast && (
          <div key={toast.id} className="cart-toast pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-emerald-950/10">
            <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" strokeLinejoin="round" d="m8 12 3 3 5-6"/></svg>
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification" className="-my-2 -mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18"/></svg>
            </button>
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
