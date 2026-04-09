import { cn } from "../../lib/utils";

type TimerMode = "focus" | "short" | "long";

interface TimerDisplayProps {
  secondsLeft: number;
  totalSeconds: number;
  mode: TimerMode;
  timerState: "idle" | "running" | "paused" | "done";
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

const MODE_RING_COLORS: Record<TimerMode, string> = {
  focus: "text-chart-1",
  short: "text-chart-3",
  long: "text-chart-2",
};

const MODE_GLOW_COLORS: Record<TimerMode, string> = {
  focus: "drop-shadow-[0_0_18px_oklch(var(--chart-1)/0.45)]",
  short: "drop-shadow-[0_0_18px_oklch(var(--chart-3)/0.45)]",
  long: "drop-shadow-[0_0_18px_oklch(var(--chart-2)/0.45)]",
};

const MODE_LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  short: "Short Break",
  long: "Long Break",
};

const STATE_LABELS: Record<string, string> = {
  idle: "Ready",
  running: "Stay focused",
  paused: "Paused",
  done: "Session complete!",
};

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerDisplay({
  secondsLeft,
  totalSeconds,
  mode,
  timerState,
}: TimerDisplayProps) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const ringColor =
    timerState === "done" ? "text-chart-2" : MODE_RING_COLORS[mode];
  const glowFilter = timerState === "running" ? MODE_GLOW_COLORS[mode] : "";

  const stateLabel =
    timerState === "running"
      ? MODE_LABELS[mode]
      : (STATE_LABELS[timerState] ?? "Ready");

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 240, height: 240 }}
    >
      {/* Background pulse when running */}
      {timerState === "running" && (
        <span
          className={cn(
            "absolute inset-0 rounded-full opacity-10 animate-ping",
            mode === "focus"
              ? "bg-chart-1"
              : mode === "short"
                ? "bg-chart-3"
                : "bg-chart-2",
          )}
          style={{ animationDuration: "3s" }}
          aria-hidden="true"
        />
      )}

      <svg
        className={cn(
          "absolute inset-0 -rotate-90 transition-all duration-500",
          glowFilter,
        )}
        width="240"
        height="240"
        viewBox="0 0 200 200"
        role="img"
        aria-label="Countdown timer progress"
      >
        {/* Track */}
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/60"
        />
        {/* Progress arc */}
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "transition-[stroke-dashoffset] duration-1000 ease-linear",
            ringColor,
          )}
          stroke="currentColor"
        />
      </svg>

      {/* Center text */}
      <div className="relative flex flex-col items-center gap-1 select-none">
        <span
          className="text-5xl font-display font-bold tabular-nums tracking-tight text-foreground"
          aria-live="off"
        >
          {formatTimer(secondsLeft)}
        </span>
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-widest transition-colors duration-300",
            timerState === "done" ? "text-chart-2" : "text-muted-foreground",
          )}
        >
          {stateLabel}
        </span>
      </div>
    </div>
  );
}
