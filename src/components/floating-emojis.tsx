"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const EMOJIS = ["😀", "🚀", "🎉", "😂", "❤️", "👍", "🤔", "🍕", "🌟", "💡", "💯", "🔥"];

export function FloatingEmojis() {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // rem
      duration: Math.random() * 10 + 10,
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-4xl"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
          }}
          animate={{
            y: [p.y, p.y - 20, p.y],
            x: [p.x, p.x + 10, p.x],
            rotate: [0, 15, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}