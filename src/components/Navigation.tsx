"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gsap } from "gsap";

const links = [
  { href: "#shaders", label: "Shaders" },
  { href: "#works", label: "Works" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    gsap.from("header nav", {
      y: -20,
      opacity: 0,
      duration: 0.8,
      delay: 0.1,
      ease: "power2.out",
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="#"
          className="font-mono text-sm tracking-widest text-foreground transition-colors hover:text-accent"
        >
          kumi<span className="text-accent">_</span>
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="#contact"
          className="rounded-full border border-accent/30 px-4 py-1.5 font-mono text-xs text-accent transition-colors hover:bg-accent/10"
        >
          connect
        </Link>
      </nav>
    </header>
  );
}
