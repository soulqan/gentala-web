"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("hero");

  const navLinks = [
    { name: "Beranda", href: "#hero", id: "hero" },
    { name: "Tentang", href: "#about", id: "about" },
    { name: "Layanan", href: "#services", id: "services" },
    { name: "Fasilitas", href: "#gallery", id: "gallery" },
    { name: "FAQ", href: "#faq", id: "faq" },
  ];

  React.useEffect(() => {
    const sections = ["hero", "about", "services", "gallery", "faq"];

    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px", // Trigger active state when section enters center viewport range
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 glassmorphic shadow-xs border-b border-slate-100/40 py-4 transition-all duration-300">
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-brand-teal font-bold text-xl tracking-tight"
        >
          <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-inner border border-slate-100">
            <Image
              src="/logo.jpeg"
              alt="Gentala Logo"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <span>Gentala</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "relative py-1.5 transition-colors duration-300 text-slate-600 hover:text-brand-teal group",
                  isActive && "text-brand-teal",
                )}
              >
                {link.name}
                {/* Underline indicator */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 w-full h-[2px] bg-brand-teal rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100",
                    isActive && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 text-slate-600 hover:text-brand-teal transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-slate-700 font-medium">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "hover:text-brand-teal py-2 transition-colors border-b border-slate-100/50",
                    isActive && "text-brand-teal font-semibold",
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
