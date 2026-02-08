import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Trophy, Star, Sparkles, PartyPopper, Flame, Target } from "lucide-react";

interface CelebrationAnimationProps {
  score: number;
  isVisible: boolean;
}

const Confetti = ({ delay, x }: { delay: number; x: number }) => (
  <div
    className="absolute animate-[confetti_3s_ease-out_forwards]"
    style={{
      left: `${x}%`,
      animationDelay: `${delay}ms`,
      top: "-20px",
    }}
  >
    <div
      className={cn(
        "w-3 h-3 rounded-sm",
        ["bg-primary", "bg-[hsl(var(--success))]", "bg-[hsl(var(--warning))]", "bg-destructive"][
          Math.floor(Math.random() * 4)
        ]
      )}
      style={{
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  </div>
);

const Sparkle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <div
    className="absolute animate-[sparkle_2s_ease-out_forwards]"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      animationDelay: `${delay}ms`,
    }}
  >
    <Sparkles className="w-6 h-6 text-[hsl(var(--warning))]" />
  </div>
);

export function CelebrationAnimation({ score, isVisible }: CelebrationAnimationProps) {
  const [confetti, setConfetti] = useState<{ delay: number; x: number }[]>([]);
  const [sparkles, setSparkles] = useState<{ delay: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (isVisible && score >= 70) {
      // Generate confetti
      const newConfetti = Array.from({ length: 50 }).map(() => ({
        delay: Math.random() * 1000,
        x: Math.random() * 100,
      }));
      setConfetti(newConfetti);

      // Generate sparkles
      const newSparkles = Array.from({ length: 20 }).map(() => ({
        delay: Math.random() * 2000,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setSparkles(newSparkles);
    }
  }, [isVisible, score]);

  if (!isVisible) return null;

  if (score >= 70) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {/* Confetti */}
        {confetti.map((c, i) => (
          <Confetti key={i} delay={c.delay} x={c.x} />
        ))}

        {/* Sparkles */}
        {sparkles.map((s, i) => (
          <Sparkle key={i} delay={s.delay} x={s.x} y={s.y} />
        ))}

        {/* Center celebration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-[celebrate_1s_ease-out_forwards] flex flex-col items-center gap-4">
            <div className="relative">
              <Trophy className="w-24 h-24 text-[hsl(var(--warning))] animate-[bounce_1s_ease-in-out_infinite]" />
              <div className="absolute -top-2 -right-2">
                <PartyPopper className="w-10 h-10 text-primary animate-[spin_2s_linear_infinite]" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Star className="w-8 h-8 text-[hsl(var(--success))] animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--warning))] via-primary to-[hsl(var(--success))] bg-clip-text text-transparent animate-pulse">
                🎉 Super Party! 🎉
              </h2>
              <p className="text-xl text-muted-foreground mt-2">
                You scored {score}%!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Motivational animation for lower scores
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-fade-in flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/90 backdrop-blur-xl border border-border shadow-2xl">
        <div className="relative">
          <Target className="w-20 h-20 text-primary animate-pulse" />
          <Flame className="absolute -top-2 -right-2 w-8 h-8 text-[hsl(var(--warning))] animate-[flicker_0.5s_ease-in-out_infinite]" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Keep Practicing! 💪</h2>
          <p className="text-muted-foreground mt-2">
            You scored {score}%. You're getting there!
          </p>
          <p className="text-sm text-primary mt-1">
            "Every expert was once a beginner"
          </p>
        </div>
      </div>
    </div>
  );
}
