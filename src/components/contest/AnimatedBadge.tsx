import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  color?: string;
  delay?: number;
}

export function AnimatedBadge({ icon: Icon, label, value, color, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative overflow-hidden rounded-xl p-3 flex items-center gap-3",
        "border border-border/50 bg-card/50 backdrop-blur-md",
        "transition-all duration-300 hover:border-primary/40",
        "hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.5)]",
      )}
    >
      {/* holographic shine */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div
        className={cn(
          "p-2 rounded-lg bg-secondary/60 transition-transform duration-300 group-hover:scale-110",
          color,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="relative">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </motion.div>
  );
}
