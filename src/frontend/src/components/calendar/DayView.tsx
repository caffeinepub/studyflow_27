import { cn, deadlineUrgency, nanoTimestampToDate } from "../../lib/utils";
import type { Assignment, ScheduledClass, Subject } from "../../types";
import { AssignmentChip } from "./AssignmentChip";
import { ClassBlock } from "./ClassBlock";

const HOUR_START = 7;
const HOUR_END = 22; // exclusive
const TOTAL_HOURS = HOUR_END - HOUR_START;
const PX_PER_HOUR = 64;

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const HOURS = Array.from({ length: TOTAL_HOURS }, (_, i) => HOUR_START + i);

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

interface DayViewProps {
  date: Date;
  classes: ScheduledClass[];
  assignments: Assignment[];
  subjects: Subject[];
  onDeleteClass: (id: bigint) => void;
}

export function DayView({
  date,
  classes,
  assignments,
  subjects,
  onDeleteClass,
}: DayViewProps) {
  const subjectMap = new Map(subjects.map((s) => [String(s.id), s]));
  const jsDay = date.getDay();

  const dayClasses = classes
    .filter((c) => Number(c.dayOfWeek) === jsDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const dayAssignments = assignments.filter((a) => {
    const d = nanoTimestampToDate(a.deadline);
    return isSameDay(d, date) && !a.isComplete;
  });

  const now = new Date();
  const isToday = isSameDay(date, now);
  const currentMinutes = isToday
    ? now.getHours() * 60 + now.getMinutes()
    : null;

  const gridHeight = TOTAL_HOURS * PX_PER_HOUR;

  return (
    <div className="flex flex-col gap-4" data-ocid="day-view">
      {/* Time grid */}
      <div className="relative flex gap-3">
        {/* Hour labels */}
        <div
          className="flex flex-col flex-shrink-0 w-14 select-none"
          style={{ height: gridHeight }}
        >
          {HOURS.map((h) => (
            <div
              key={`hour-label-${h}`}
              className="text-[10px] text-muted-foreground text-right pr-2 flex-shrink-0"
              style={{ height: PX_PER_HOUR, lineHeight: "1" }}
            >
              {formatHour(h)}
            </div>
          ))}
        </div>

        {/* Grid area */}
        <div
          className="relative flex-1 border border-border rounded-lg bg-card overflow-hidden"
          style={{ height: gridHeight }}
        >
          {/* Hour grid lines */}
          {HOURS.map((h, i) => (
            <div
              key={`grid-line-${h}`}
              className="absolute left-0 right-0 border-t border-border/40"
              style={{ top: i * PX_PER_HOUR }}
            />
          ))}

          {/* Current time indicator */}
          {currentMinutes !== null && (
            <div
              className="absolute left-0 right-0 z-20 pointer-events-none"
              style={{
                top: ((currentMinutes - HOUR_START * 60) / 60) * PX_PER_HOUR,
              }}
            >
              <div className="relative flex items-center">
                <span className="size-2.5 rounded-full bg-primary flex-shrink-0 -ml-1.5" />
                <div className="flex-1 h-px bg-primary" />
              </div>
            </div>
          )}

          {/* Class blocks */}
          {dayClasses.map((cls) => {
            const startMin = parseTimeToMinutes(cls.startTime);
            const durationMin = Number(cls.durationMinutes);
            const topPx = ((startMin - HOUR_START * 60) / 60) * PX_PER_HOUR;
            const heightPx = (durationMin / 60) * PX_PER_HOUR;

            return (
              <ClassBlock
                key={String(cls.id)}
                cls={cls}
                subject={subjectMap.get(String(cls.subjectId))}
                timePositioned
                topPx={topPx}
                heightPx={Math.max(heightPx, 28)}
                onDelete={onDeleteClass}
              />
            );
          })}
        </div>
      </div>

      {/* Assignments due this day */}
      {dayAssignments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Due This Day
          </p>
          <div className="flex flex-col gap-1.5">
            {dayAssignments.map((a) => {
              const urgency = deadlineUrgency(a.deadline);
              return (
                <div
                  key={String(a.id)}
                  data-ocid="day-assignment-row"
                  className={cn(
                    "rounded-md border overflow-hidden",
                    urgency === "overdue"
                      ? "border-destructive/40"
                      : "border-border",
                  )}
                >
                  <AssignmentChip
                    assignment={a}
                    subject={subjectMap.get(String(a.subjectId))}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {dayClasses.length === 0 && dayAssignments.length === 0 && (
        <div
          data-ocid="day-empty-state"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <span className="text-xl">📅</span>
          </div>
          <p className="text-sm font-medium text-foreground">Free day!</p>
          <p className="text-xs text-muted-foreground mt-1">
            No classes or deadlines scheduled
          </p>
        </div>
      )}
    </div>
  );
}
