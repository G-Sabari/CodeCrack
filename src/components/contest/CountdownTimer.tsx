import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CountdownTimer({ days, hours, minutes, seconds, size = "md", className }: Props) {
  const blocks = [
    { label: "DAYS", value: days },
    { label: "HRS", value: hours },
    { label: "MIN", value: minutes },
    { label: "SEC", value: seconds },
  ];

  const sizes = {
    sm: { box: "min-w-[52px] px-2.5 py-1.5", num: "text-lg", lbl: "text-[9px]" },
    md: { box: "min-w-[64px] px-3 py-2", num: "text-2xl", lbl: "text-[10px]" },
    lg: { box: "min-w-[80px] px-4 py-3", num: "text-3xl md:text-4xl", lbl: "text-[11px]" },
  }[size];

  return (
    <div className={cn("flex gap-2", className)}>
      {blocks.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={cn(
            "relative rounded-xl text-center overflow-hidden",
            "border border-primary/30 bg-gradient-to-br from-background/70 via-card/80 to-primary/10",
            "backdrop-blur-md shadow-[0_0_20px_-8px_hsl(var(--primary)/0.5)]",
            sizes.box,
          )}
        >
          {/* shine sweep */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <motion.div
            key={b.value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className={cn("font-bold text-primary tabular-nums leading-none", sizes.num)}
          >
            {String(b.value).padStart(2, "0")}
          </motion.div>
          <div className={cn("uppercase tracking-[0.15em] text-muted-foreground mt-1", sizes.lbl)}>
            {b.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
