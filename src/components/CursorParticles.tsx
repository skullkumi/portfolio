"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#00e5c8", "#ff3d7a", "#7c6bff", "#9ec8ff", "#f5a623"];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: -100, y: -100, lastX: -100, lastY: -100, active: false });
  const rafRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const pickColor = () => COLORS[(Math.random() * COLORS.length) | 0];

    const spawn = (x: number, y: number, dx: number, dy: number, count = 1) => {
      const speed = Math.hypot(dx, dy);
      const nx = speed > 0.01 ? dx / speed : 0;
      const ny = speed > 0.01 ? dy / speed : 0;
      const pool = particlesRef.current;

      for (let i = 0; i < count; i++) {
        if (pool.length >= 70) pool.shift();

        const life = 0.22 + Math.random() * 0.18;
        pool.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: nx * (14 + Math.random() * 20) + (Math.random() - 0.5) * 30,
          vy: ny * (14 + Math.random() * 20) + (Math.random() - 0.5) * 30,
          life,
          maxLife: life,
          size: 1.5 + Math.random() * 2,
          color: pickColor(),
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const schedule = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const p = pointerRef.current;
      const dx = e.clientX - p.lastX;
      const dy = e.clientY - p.lastY;
      const dist = Math.hypot(dx, dy);

      p.x = e.clientX;
      p.y = e.clientY;
      p.active = true;

      if (dist > 5) {
        spawn(e.clientX, e.clientY, dx, dy, dist > 20 ? 2 : 1);
        p.lastX = e.clientX;
        p.lastY = e.clientY;
        schedule();
      }
    };

    const onLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;

      const pool = particlesRef.current;
      if (pool.length === 0) {
        runningRef.current = false;
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.life -= dt;
        if (p.life <= 0) {
          pool.splice(i, 1);
          continue;
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.vy += 10 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const t = p.life / p.maxLife;
        ctx.globalAlpha = t * t * 0.8;
        ctx.fillStyle = p.color;
        const size = p.size * (0.4 + t * 0.6);
        ctx.fillRect(p.x - size * 0.5, p.y - size * 0.5, size, size);
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(tick);
    };

    return () => {
      cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      particlesRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden
    />
  );
}
