import { motion } from "framer-motion";
import { Crown, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PodiumEntry {
  name: string;
  score: number;
}

interface Props {
  entries: [PodiumEntry?, PodiumEntry?, PodiumEntry?];
}

export function Podium({ entries }: Props) {
  const [first, second, third] = entries;

  const Pillar = ({
    place,
    entry,
    height,
    color,
    glow,
    badge,
    delay,
  }: {
    place: 1 | 2 | 3;
    entry?: PodiumEntry;
    height: string;
    color: string;
    glow: string;
    badge: React.ReactNode;
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn("flex flex-col items-center", place === 2 && "pt-6", place === 3 && "pt-10")}
    >
      <div className="relative mb-3">
        {place === 1 && (
          <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-6 text-[hsl(45,100%,55%)] animate-pulse drop-shadow-[0_0_8px_hsl(45,100%,55%)]" />
        )}
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-bold text-background border-2",
            place === 1 ? "h-20 w-20 text-3xl" : "h-16 w-16 text-2xl",
          )}
          style={{
            background: `linear-gradient(135deg, ${color}, hsl(0 0% 20%))`,
            borderColor: color,
            boxShadow: place === 1 ? `0 0 35px ${glow}` : `0 0 20px ${glow}`,
          }}
        >
          {entry?.name?.charAt(0) ?? "?"}
        </div>
        <div
          className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-card border-2 flex items-center justify-center text-[10px] font-bold"
          style={{ borderColor: color }}
        >
          {badge}
        </div>
      </div>
      <p className={cn("font-semibold text-sm text-center max-w-[110px] truncate", place === 1 && "font-bold")}>
        {entry?.name ?? "—"}
      </p>
      <p className="text-lg font-bold" style={{ color }}>
        {entry?.score ?? 0}
      </p>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: place === 1 ? 128 : place === 2 ? 96 : 64 }}
        transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
        className="w-full mt-2 rounded-t-2xl border border-b-0 relative overflow-hidden"
        style={{
          borderColor: `${color}55`,
          background: `linear-gradient(to top, ${color}33, ${color}08)`,
          height,
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ animationDelay: `${delay + 0.5}s` }}
        />
        <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold" style={{ color }}>
          #{place}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto items-end">
      <Pillar
        place={2}
        entry={second}
        height="96px"
        color="hsl(0,0%,75%)"
        glow="hsl(0 0% 75% / 0.4)"
        badge={<span>2</span>}
        delay={0.15}
      />
      <Pillar
        place={1}
        entry={first}
        height="128px"
        color="hsl(45,100%,55%)"
        glow="hsl(45 100% 55% / 0.5)"
        badge={<Star className="h-3 w-3 text-[hsl(45,100%,55%)]" />}
        delay={0}
      />
      <Pillar
        place={3}
        entry={third}
        height="64px"
        color="hsl(25,75%,55%)"
        glow="hsl(25 75% 55% / 0.35)"
        badge={<Medal className="h-3 w-3 text-[hsl(25,75%,55%)]" />}
        delay={0.3}
      />
    </div>
  );
}
