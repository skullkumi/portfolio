"use client";

import { ReactNode } from "react";

type ParallaxCardProps = {
  children: ReactNode;
  className?: string;
  depth?: number;
};

export function ParallaxCard({ children, className = "" }: ParallaxCardProps) {
  return <div className={className}>{children}</div>;
}
