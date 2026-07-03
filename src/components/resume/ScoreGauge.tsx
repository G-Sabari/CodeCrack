import { cn } from "@/lib/utils";

interface Props {
  value: number;
  label?: string;
  size?: number;
  className?: string;
}

export function ScoreGauge({ value, label, size = 140, className }: Props) {
  const v = Math.max(0, Math.min(100, Math.round(value || 0)));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  const color = v >= 80 ? "hsl(142,76%,45%)" : v >= 60 ? "hsl(var(--primary))" : v >= 40 ? "hsl(38,92%,55%)" : "hsl(0,84%,60%)";
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke="hsl(var(--muted))" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          strokeWidth={stroke} stroke={color} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{v}</span>
        {label && <span className="text-xs text-muted-foreground mt-1">{label}</span>}
      </div>
    </div>
  );
}
