"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type ParallaxCardProps = {
  children: React.ReactNode;
  className?: string;
  depth?: number;
};

export function ParallaxCard({
  children,
  className = "",
  depth = 12,
}: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hovering = useMotionValue(0);
  const hoverSpring = useSpring(hovering, { stiffness: 200, damping: 22 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [depth * 0.5, -depth * 0.5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-depth * 0.5, depth * 0.5]);
  const translateX = useTransform(springX, [-0.5, 0.5], [-depth, depth]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-depth, depth]);
  const liftZ = useTransform(hoverSpring, [0, 1], [0, -12]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    hovering.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        z: liftZ,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => hovering.set(1)}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
