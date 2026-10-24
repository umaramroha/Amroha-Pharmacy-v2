"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Client-side wrapper that gives a <section> the same fade-up scroll animation
 * the home page already had. The content passed as `children` can be a
 * server component: only this thin wrapper needs the browser.
 */
export default function RevealSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
