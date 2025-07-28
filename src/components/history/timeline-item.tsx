"use client";

import { motion } from "framer-motion";
import React from "react";

export const TimelineItem = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      className="relative pl-16 sm:pl-24 pb-16"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute left-0 top-0 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full -translate-x-1/2 ring-8 ring-background">
        <Icon className="w-7 h-7" />
      </div>
      <div className="ml-4">
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">{title}</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-strong:text-foreground prose-code:bg-muted prose-code:p-1 prose-code:rounded-md prose-code:font-mono">
          {children}
        </div>
      </div>
    </motion.div>
  );
};