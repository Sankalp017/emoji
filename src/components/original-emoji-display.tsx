"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const originalEmojis = [
  { char: "❤️", name: "Heart" },
  { char: "☀️", name: "Sun" },
  { char: "☁️", name: "Cloud" },
  { char: "📱", name: "Phone" },
  { char: "🚗", name: "Car" },
  { char: "🌕", name: "Full Moon" },
  { char: "♈️", name: "Aries" },
  { char: "1️⃣", name: "Number 1" },
  { char: "📟", name: "Pager" },
  { char: "🎮", name: "Game" },
  { char: "🎵", name: "Music Note" },
  { char: "💴", name: "Yen" },
];

export function OriginalEmojiDisplay() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 rounded-lg border w-full max-w-sm">
        {originalEmojis.map((emoji, i) => (
          <Tooltip key={i}>
            <TooltipTrigger>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="flex items-center justify-center aspect-square cursor-pointer text-4xl"
              >
                {emoji.char}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{emoji.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}