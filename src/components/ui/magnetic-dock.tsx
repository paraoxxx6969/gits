"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DockItemData {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export interface MinimalDockProps {
  items: DockItemData[];
  onSelect?: (id: string) => void;
  className?: string;
}

function DockIcon({
  item,
  mouseX,
  onSelect,
}: {
  item: DockItemData;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onSelect?: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  // Distance from mouse cursor to item center for fluid Apple MacBook Dock scaling
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { left: 0, width: 0 };
    return val - bounds.left - bounds.width / 2;
  });

  // Apple MacBook Dock expansion: 48px base -> 72px hover peak
  const widthTransform = useTransform(distance, [-140, 0, 140], [48, 74, 48]);
  const heightTransform = useTransform(distance, [-140, 0, 140], [48, 74, 48]);

  // Zero-delay responsive spring physics matching macOS Dock
  const springConfig = { mass: 0.1, stiffness: 280, damping: 18 };
  const width = useSpring(widthTransform, springConfig);
  const height = useSpring(heightTransform, springConfig);

  // Floating Y lift on hover
  const yTransform = useTransform(distance, [-140, 0, 140], [0, -8, 0]);
  const y = useSpring(yTransform, springConfig);

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute -top-10 z-50 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-black shadow-xl border border-neutral-200 pointer-events-none"
          >
            {item.label}
            {/* Downward triangle arrow */}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        style={{ width, height, y }}
        onClick={() => {
          item.onClick?.();
          onSelect?.(item.id);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center rounded-2xl p-0",
          "bg-neutral-900 border border-neutral-800 text-neutral-200",
          "shadow-md transition-colors duration-200 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          item.isActive && "bg-neutral-800 border-neutral-600 text-white"
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center stroke-current">
          {item.icon}
        </div>
      </motion.button>

      {/* macOS Dock Active Indicator Dot */}
      {item.isActive && (
        <motion.div
          layoutId="activeDot"
          className="absolute -bottom-2 h-1 w-1 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />
      )}
    </div>
  );
}

export function MinimalMacDock({
  items,
  onSelect,
  className,
}: MinimalDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "flex items-end gap-4 rounded-2xl px-4 py-2.5",
          "bg-neutral-950/90 backdrop-blur-2xl border border-white/10",
          "shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        )}
      >
        {items.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} onSelect={onSelect} />
        ))}
      </motion.div>
    </div>
  );
}

export default MinimalMacDock;
