"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const originalEmojis = [
  { src: "e-439.png", name: "Heart" },
  { src: "e-44B.png", name: "Sun" },
  { src: "e-44D.png", name: "Cloud" },
  { src: "e-453.png", name: "Phone" },
  { src: "e-45A.png", name: "Car" },
  { src: "e-465.png", name: "Full Moon" },
  { src: "e-474.png", name: "Aries" },
  { src: "e-4A2.png", name: "Number 1" },
  { src: "e-4B8.png", name: "PHS (Pager)" },
  { src: "e-48D.png", name: "Game" },
  { src: "e-490.png", name: "Music Note" },
  { src: "e-49B.png", name: "Yen" },
];

const baseUrl =
  "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/docomo/20/";

export function OriginalEmojiDisplay() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 rounded-lg border w-full max-w-sm">
        {originalEmojis.map((emoji, i) => (
          <Tooltip key={i}>
            <TooltipTrigger>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="flex items-center justify-center aspect-square cursor-pointer"
              >
                <Image
                  src={`${baseUrl}${emoji.src}`}
                  alt={emoji.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="pixelated"
                />
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