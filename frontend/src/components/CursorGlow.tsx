"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override scroll restoration to manual and force scroll to top on page load/refresh
    if (typeof window !== "undefined") {
      if (window.history && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    // Position caches
    const mouse = { x: 0, y: 0 };
    const currentRing = { x: 0, y: 0 };
    const currentGlow = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instantly position the small dot (and offset by half its size)
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Buttery smooth animation using LERP (Linear Interpolation)
    let animationFrameId: number;
    const render = () => {
      // Trailing ring movement (18% interpolation factor for smooth lag)
      currentRing.x += (mouse.x - currentRing.x) * 0.18;
      currentRing.y += (mouse.y - currentRing.y) * 0.18;
      ring.style.transform = `translate3d(${currentRing.x}px, ${currentRing.y}px, 0) translate(-50%, -50%)`;

      // Background ambient glow movement (8% interpolation factor for ultra-lazy lag)
      currentGlow.x += (mouse.x - currentGlow.x) * 0.08;
      currentGlow.y += (mouse.y - currentGlow.y) * 0.08;
      glow.style.transform = `translate3d(${currentGlow.x}px, ${currentGlow.y}px, 0) translate(-50%, -50%)`;

      animationFrameId = requestAnimationFrame(render);
    };

    // Global listener to check if hovering over clickable items
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        target.getAttribute("role") === "button"
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseover", onMouseOver);

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <>
      {/* Background Ambient Glow */}
      <div
        ref={glowRef}
        id="cursor-glow"
        className="pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(var(--color-signal-rgb), 0.07) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Custom Mouse Cursor (Hidden on touch devices via globals.css) */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal transition-opacity duration-300 custom-cursor ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: "6px",
          height: "6px",
          zIndex: 9999,
        }}
        aria-hidden="true"
      />

      {/* Trailing Magnetic Ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/45 bg-signal/5 transition-all duration-150 custom-cursor ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovered ? "w-11 h-11 bg-signal/15 border-signal scale-110" : "w-7 h-7"}`}
        style={{
          zIndex: 9998,
        }}
        aria-hidden="true"
      />
    </>
  );
}
