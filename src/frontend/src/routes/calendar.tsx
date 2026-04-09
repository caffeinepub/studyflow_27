import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DayView } from "../components/calendar/DayView";
import { WeekView } from "../components/calendar/WeekView";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  useAssignments,
  useCreateScheduledClass,
  useDeleteScheduledClass,
  useScheduledClasses,
  useSubjects,
} from "../hooks/useBackend";
import { cn, getDayName } from "../lib/utils";
import type { Subject } from "../types";

const DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

/** Get Monday of the week containing the given date */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatMonthRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.toLocaleDateString("en-US", opts)} – ${sunday.getDate()}, ${sunday.getFullYear()}`;
  }
  return `${monday.toLocaleDateString("en-US", opts)} – ${sunday.toLocaleDateString("en-US", opts)}, ${sunday.getFullYear()}`;
}

function formatDayHeader(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Add Class Dialog ────────────────────────────────────────────────────────

function AddClassDialog({
  open,
  onOpenChange,
  subjects,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subjects: Subject[];
}) {
  const [subjectId, setSubjectId] = useState("");
  const [day, setDay] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState("60");
  const createMut = useCreateScheduledClass();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectId) return;
    try {
      await createMut.mutateAsync({
        subjectId: subjects.find((s) => String(s.id) === subjectId)!.id,
        dayOfWeek: Number(day),
        startTime,
        durationMinutes: Number(duration),
      });
      toast.success("Class scheduled");
      onOpenChange(false);
    } catch {
      toast.error("Failed to schedule class");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Schedule a Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger data-ocid="class-subject-select">
                <SelectValue placeholder="Select subject..." />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={String(s.id)} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Day</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger data-ocid="class-day-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={String(d)} value={String(d)}>
                      {getDayName(d)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="class-time">Start Time</Label>
              <Input
                id="class-time"
                data-ocid="class-time-input"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="class-duration">Duration (minutes)</Label>
            <Input
              id="class-duration"
              data-ocid="class-duration-input"
              type="number"
              min={15}
              max={300}
              step={15}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="class-save-btn"
              disabled={!subjectId || createMut.isPending}
            >
              Schedule class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Calendar Page ────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { data: classes = [] } = useScheduledClasses();
  const { data: subjects = [] } = useSubjects();
  const { data: assignments = [] } = useAssignments();
  const deleteMut = useDeleteScheduledClass();

  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [weekStart, setWeekStart] = useState<Date>(() =>
    getMondayOf(new Date()),
  );
  const [selectedDay, setSelectedDay] = useState<Date>(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  async function handleDeleteClass(id: bigint) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success("Class removed");
    } catch {
      toast.error("Failed to remove class");
    }
  }

  function goToPrevWeek() {
    setWeekStart((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 7);
      return next;
    });
  }

  function goToNextWeek() {
    setWeekStart((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 7);
      return next;
    });
  }

  function goToPrevDay() {
    setSelectedDay((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 1);
      return next;
    });
  }

  function goToNextDay() {
    setSelectedDay((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    });
  }

  function goToToday() {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    setSelectedDay(t);
    setWeekStart(getMondayOf(t));
  }

  const isThisWeek = weekStart.getTime() === getMondayOf(new Date()).getTime();

  const isToday = (() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return selectedDay.getTime() === t.getTime();
  })();

  return (
    <div
      data-ocid="calendar-page"
      className="flex flex-col gap-5 p-6 max-w-[1200px] mx-auto"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CalendarDays className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
              Calendar
            </h1>
            <p className="text-sm text-muted-foreground">
              {viewMode === "week"
                ? formatMonthRange(weekStart)
                : formatDayHeader(selectedDay)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View toggle */}
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 gap-0.5">
            <button
              type="button"
              data-ocid="week-view-btn"
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                viewMode === "week"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Week
            </button>
            <button
              type="button"
              data-ocid="day-view-btn"
              onClick={() => setViewMode("day")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                viewMode === "day"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Day
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              data-ocid="prev-btn"
              className="size-8"
              onClick={viewMode === "week" ? goToPrevWeek : goToPrevDay}
              aria-label="Previous"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              data-ocid="today-btn"
              onClick={goToToday}
              className={cn(
                "text-xs px-2.5 h-8",
                (viewMode === "week" ? isThisWeek : isToday) &&
                  "bg-primary/10 border-primary/30 text-primary",
              )}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              data-ocid="next-btn"
              className="size-8"
              onClick={viewMode === "week" ? goToNextWeek : goToNextDay}
              aria-label="Next"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <Button
            data-ocid="add-class-btn"
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="gap-1.5 h-8"
          >
            <Plus className="size-3.5" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Calendar view */}
      {viewMode === "week" ? (
        <WeekView
          weekStart={weekStart}
          classes={classes}
          assignments={assignments}
          subjects={subjects}
          onDeleteClass={handleDeleteClass}
        />
      ) : (
        <DayView
          date={selectedDay}
          classes={classes}
          assignments={assignments}
          subjects={subjects}
          onDeleteClass={handleDeleteClass}
        />
      )}

      <AddClassDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subjects={subjects}
      />
    </div>
  );
}
