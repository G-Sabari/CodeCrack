import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Props {
  count?: number;
  className?: string;
  /** Tailwind/HSL color string applied via inline style */
  color?: string;
}

/**
 * Decorative ambient layer: animated gradient mesh + floating glow orbs +
 * subtle drifting particles. Pure presentation, pointer-events: none, fixed.
 */
export function FloatingParticles({ count = 18, className, color }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: -Math.random() * 12,
        duration: 12 + Math.random() * 14,
        opacity: 0.25 + Math.random() * 0.5,
      })),
    [count],
  );

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 pointer-events-none overflow-hidden z-0",
        className,
      )}
    >
      {/* Mesh gradient blobs */}
      <div className="absolute -top-32 -left-24 w-[640px] h-[640px] rounded-full blur-[140px] opacity-40 animate-float-slow"
        style={{ background: color ?? "hsl(var(--primary) / 0.35)" }} />
      <div className="absolute -bottom-32 -right-24 w-[560px] h-[560px] rounded-full blur-[140px] opacity-30 animate-float-slow"
        style={{ background: "hsl(var(--accent) / 0.3)", animationDelay: "6s" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-[120px] opacity-20 animate-float-slow"
        style={{ background: "hsl(200 90% 60% / 0.3)", animationDelay: "11s" }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary animate-particle-drift"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: "0 0 8px hsl(var(--primary) / 0.6)",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
