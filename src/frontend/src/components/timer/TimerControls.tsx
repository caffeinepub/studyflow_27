import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "../ui/button";

type TimerState = "idle" | "running" | "paused" | "done";
type TimerMode = "focus" | "short" | "long";

interface TimerControlsProps {
  timerState: TimerState;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({
  timerState,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Reset — always visible except idle */}
      {timerState !== "idle" && (
        <Button
          data-ocid="timer-reset-btn"
          variant="ghost"
          size="icon"
          onClick={onReset}
          aria-label="Reset timer"
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-4" />
        </Button>
      )}

      {/* Primary action */}
      {timerState === "idle" && (
        <Button
          data-ocid="timer-start-btn"
          size="lg"
          onClick={onStart}
          className="gap-2 px-10 h-12 text-base font-semibold rounded-full shadow-md"
        >
          <Play className="size-4 fill-current" />
          Start
        </Button>
      )}

      {timerState === "running" && (
        <Button
          data-ocid="timer-pause-btn"
          size="lg"
          variant="outline"
          onClick={onPause}
          className="gap-2 px-10 h-12 text-base font-semibold rounded-full"
        >
          <Pause className="size-4" />
          Pause
        </Button>
      )}

      {timerState === "paused" && (
        <Button
          data-ocid="timer-resume-btn"
          size="lg"
          onClick={onResume}
          className="gap-2 px-10 h-12 text-base font-semibold rounded-full shadow-md"
        >
          <Play className="size-4 fill-current" />
          Resume
        </Button>
      )}

      {timerState === "done" && (
        <Button
          data-ocid="timer-new-session-btn"
          size="lg"
          variant="outline"
          onClick={onReset}
          className="gap-2 px-8 h-12 text-base font-semibold rounded-full"
        >
          <RotateCcw className="size-4" />
          New session
        </Button>
      )}

      {/* Skip to next phase */}
      {(timerState === "running" || timerState === "paused") && (
        <Button
          data-ocid="timer-skip-btn"
          variant="ghost"
          size="icon"
          onClick={onSkip}
          aria-label="Skip to next phase"
          className="text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="size-4" />
        </Button>
      )}
    </div>
  );
}
