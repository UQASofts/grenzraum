import { useMemo } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface StampCelebrationProps {
  active: boolean;
  message?: string;
  subMessage?: string;
}

const CONFETTI_COLORS = [
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#d946ef",
  "#eab308",
  "#10b981",
  "#f97316",
  "#8b5cf6",
];

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  width: number;
  height: number;
  drift: number;
  spin: number;
  peakY: number;
};

function buildConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 0.35,
    duration: 2.4 + Math.random() * 1.4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    width: 5 + Math.random() * 7,
    height: 3 + Math.random() * 5,
    drift: (Math.random() - 0.5) * 140,
    spin: 180 + Math.random() * 540,
    peakY: -(55 + Math.random() * 35),
  }));
}

export default function StampCelebration({
  active,
  message = "Stamp Collected!",
  subMessage = "Another adventure logged on your pass.",
}: StampCelebrationProps) {
  const pieces = useMemo(() => buildConfetti(56), [active]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
      aria-hidden
    >
      {pieces.map((piece) => (
        <motion.span
          key={`${active}-${piece.id}`}
          className="absolute bottom-0 block rounded-[1px] shadow-sm"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
          }}
          initial={{ y: "0vh", x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: ["0vh", `${piece.peakY}vh`, "105vh"],
            x: [0, piece.drift * 0.6, piece.drift],
            opacity: [0, 1, 1, 0.85, 0],
            rotate: [0, piece.spin * 0.5, piece.spin],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: ["easeOut", "easeIn"],
            times: [0, 0.42, 1],
          }}
        />
      ))}

      <motion.div
        className="absolute left-1/2 top-[28%] w-[min(90vw,320px)] -translate-x-1/2 rounded-2xl border border-emerald-200 bg-white/95 px-6 py-5 text-center shadow-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="font-display text-lg font-extrabold uppercase tracking-wide text-slate-900">
          {message}
        </p>
        <p className="mt-1 text-xs text-slate-500">{subMessage}</p>
      </motion.div>
    </div>
  );
}
