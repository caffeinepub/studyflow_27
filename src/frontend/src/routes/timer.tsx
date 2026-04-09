import { Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SessionHistory } from "../components/timer/SessionHistory";
import { SessionSelector } from "../components/timer/SessionSelector";
import { TimerControls } from "../components/timer/TimerControls";
import { TimerDisplay } from "../components/timer/TimerDisplay";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import {
  useAssignments,
  useLogPomodoroSession,
  usePomodoroSessions,
  useStudyStats,
  useSubjects,
} from "../hooks/useBackend";
import { cn, formatMinutes } from "../lib/utils";

type TimerMode = "focus" | "short" | "long";
type TimerState = "idle" | "running" | "paused" | "done";

const MODE_LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  short: "Short Break",
  long: "Long Break",
};

const MODE_COLORS: Record<TimerMode, string> = {
  focus: "text-chart-1 border-chart-1/40 bg-chart-1/10",
  short: "text-chart-3 border-chart-3/40 bg-chart-3/10",
  long: "text-chart-2 border-chart-2/40 bg-chart-2/10",
};

const MODES: TimerMode[] = ["focus", "short", "long"];

interface TimerSettings {
  focus: number;
  short: number;
  long: number;
}

const DEFAULT_SETTINGS: TimerSettings = { focus: 25, short: 5, long: 15 };

export default function TimerPage() {
  const { data: subjects = [] } = useSubjects();
  const { data: assignments = [] } = useAssignments();
  const { data: sessions = [] } = usePomodoroSessions();
  const { data: stats } = useStudyStats();
  const logMut = useLogPomodoroSession();

  // Timer settings
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  // Timer state
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SETTINGS.focus * 60);

  // Session context
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("none");
  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState<string>("none");

  // Track how many focus sessions completed this cycle (for long break trigger)
  const focusCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef<TimerMode>("focus");
  modeRef.current = mode;

  const totalSeconds = settings[mode] * 60;

  // Switch mode and reset timer
  function switchMode(newMode: TimerMode) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(newMode);
    setTimerState("idle");
    setSecondsLeft(settings[newMode] * 60);
  }

  function updateSetting(key: keyof TimerSettings, value: number) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === mode && timerState === "idle") {
      setSecondsLeft(value * 60);
    }
  }

  // Interval runner
  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerState("done");
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSessionComplete() {
    const currentMode = modeRef.current;

    if (currentMode === "focus") {
      focusCountRef.current += 1;
      // Auto-log the focus session
      try {
        const subId =
          selectedSubjectId !== "none"
            ? (subjects.find((s) => String(s.id) === selectedSubjectId)?.id ??
              null)
            : null;
        const asgId =
          selectedAssignmentId !== "none"
            ? (assignments.find((a) => String(a.id) === selectedAssignmentId)
                ?.id ?? null)
            : null;
        await logMut.mutateAsync({
          subjectId: subId,
          assignmentId: asgId,
          durationMinutes: settings.focus,
        });
        toast.success(`Focus session logged — ${settings.focus} min!`, {
          description: "Great work! Take a break.",
          action: {
            label: "Skip break",
            onClick: () => switchMode("focus"),
          },
        });
      } catch {
        toast.error("Failed to log session");
      }

      // Auto-switch to break
      const nextMode = focusCountRef.current % 4 === 0 ? "long" : "short";
      setTimeout(() => {
        switchMode(nextMode);
        toast.info(`${nextMode === "long" ? "Long" : "Short"} break started!`);
      }, 800);
    } else {
      // Break ended — return to focus
      toast.info("Break over! Ready to focus?");
      setTimeout(() => {
        switchMode("focus");
      }, 800);
    }
  }

  function handleStart() {
    setTimerState("running");
  }

  function handlePause() {
    setTimerState("paused");
  }

  function handleResume() {
    setTimerState("running");
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerState("idle");
    setSecondsLeft(settings[mode] * 60);
  }

  function handleSkip() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const nextMode =
      mode === "focus"
        ? focusCountRef.current % 4 === 0
          ? "long"
          : "short"
        : "focus";
    switchMode(nextMode);
  }

  const todayMinutes = sessions.reduce((acc, s) => {
    const date = new Date(Number(s.completedAt / 1_000_000n));
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return acc + Number(s.durationMinutes);
    }
    return acc;
  }, 0);

  return (
    <div
      data-ocid="timer-page"
      className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto"
    >
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Focus Timer
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pomodoro-style sessions — stay focused, take breaks
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings((v) => !v)}
          aria-label="Timer settings"
          data-ocid="timer-settings-btn"
          className={cn(
            "transition-smooth",
            showSettings ? "bg-muted text-foreground" : "text-muted-foreground",
          )}
        >
          {showSettings ? (
            <X className="size-4" />
          ) : (
            <Settings className="size-4" />
          )}
        </Button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <Card className="card-elevated animate-in fade-in slide-in-from-top-2 duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display">
              Timer Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(["focus", "short", "long"] as const).map((key) => {
              const [min, max] =
                key === "focus"
                  ? [10, 60]
                  : key === "short"
                    ? [1, 15]
                    : [10, 30];
              const keyLabels: Record<string, string> = {
                focus: "Focus duration",
                short: "Short break",
                long: "Long break",
              };
              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{keyLabels[key]}</Label>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {settings[key]} min
                    </span>
                  </div>
                  <Slider
                    data-ocid={`setting-${key}`}
                    min={min}
                    max={max}
                    step={1}
                    value={[settings[key]]}
                    onValueChange={([v]) => updateSetting(key, v)}
                    disabled={timerState === "running"}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{min}m</span>
                    <span>{max}m</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer panel */}
        <div className="lg:col-span-2">
          <Card className="card-elevated">
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
              {/* Mode tabs */}
              <div
                className="flex gap-1 p-1 bg-muted/60 rounded-xl"
                role="tablist"
                aria-label="Timer mode"
              >
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    data-ocid={`mode-tab-${m}`}
                    onClick={() => switchMode(m)}
                    disabled={timerState === "running"}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-smooth",
                      mode === m
                        ? cn("shadow-sm border", MODE_COLORS[m])
                        : "text-muted-foreground hover:text-foreground disabled:opacity-50",
                    )}
                  >
                    {MODE_LABELS[m]}
                  </button>
                ))}
              </div>

              {/* Circular timer display */}
              <TimerDisplay
                secondsLeft={secondsLeft}
                totalSeconds={totalSeconds}
                mode={mode}
                timerState={timerState}
              />

              {/* Controls */}
              <TimerControls
                timerState={timerState}
                mode={mode}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
                onSkip={handleSkip}
              />

              {/* Session context selectors */}
              <div className="w-full border-t border-border pt-4">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Optional: link this session to a subject or assignment
                </p>
                <div className="flex justify-center">
                  <SessionSelector
                    subjects={subjects}
                    assignments={assignments}
                    selectedSubjectId={selectedSubjectId}
                    selectedAssignmentId={selectedAssignmentId}
                    disabled={timerState === "running"}
                    onSubjectChange={setSelectedSubjectId}
                    onAssignmentChange={setSelectedAssignmentId}
                  />
                </div>
              </div>

              {/* Cycle tracker */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground mr-1">
                  Cycle:
                </span>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={`cycle-dot-${i}`}
                    className={cn(
                      "size-2.5 rounded-full border transition-smooth",
                      i < focusCountRef.current % 4
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30 bg-transparent",
                    )}
                    aria-hidden="true"
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {4 - (focusCountRef.current % 4)} until long break
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Quick stats */}
          <Card className="card-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">
                Study Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {formatMinutes(todayMinutes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This week</span>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {formatMinutes(
                    stats ? Number(stats.totalMinutesThisWeek) : 0,
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Sessions today
                </span>
                <Badge variant="secondary" className="tabular-nums">
                  {stats ? Number(stats.sessionsToday) : 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total logged
                </span>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {sessions.length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Session history */}
          <SessionHistory
            sessions={sessions}
            subjects={subjects}
            assignments={assignments}
          />
        </div>
      </div>
    </div>
  );
}
