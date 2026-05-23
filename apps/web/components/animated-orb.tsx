"use client";

import { motion } from "framer-motion";

export function AnimatedOrb() {
  return (
    <motion.div
      aria-hidden
      className="absolute right-[-4rem] top-[-2rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(67,240,209,0.26)_0%,rgba(67,240,209,0.08)_34%,transparent_70%)] blur-2xl"
      animate={{ y: [0, -16, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
