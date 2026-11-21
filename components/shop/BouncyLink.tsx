"use client";
import { motion } from "motion/react";

// Tautan/tombol utama yang membal (spring) saat disentuh.
export function BouncyLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.a href={href} className={className} whileHover={{ scale: 1.06, rotate: -2 }} whileTap={{ scale: 0.9, rotate: 2 }} transition={{ type: "spring", stiffness: 520, damping: 11 }}>
      {children}
    </motion.a>
  );
}
