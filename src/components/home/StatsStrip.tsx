"use client";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

function Counter({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, isInView]);

  return (
    <div ref={ref} className="text-center p-4">
      <p className="text-2xl md:text-4xl font-extrabold text-primary mb-1">{count.toLocaleString('en-IN')}{suffix}</p>
      <p className="text-xs md:text-sm font-semibold text-gray-600">{label}</p>
    </div>
  );
}

export default function StatsStrip() {
  return (
    <div className="bg-white border-y border-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
        <Counter end={10000} suffix="+" label="Happy Customers" />
        <Counter end={100} suffix="+" label="Ayurvedic Products" />
        <Counter end={500} suffix="+" label="PIN Codes Served" />
        <Counter end={100} suffix="%" label="Authentic Quality" />
      </div>
    </div>
  );
}