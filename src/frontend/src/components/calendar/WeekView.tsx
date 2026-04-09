import {
  cn,
  deadlineUrgency,
  getDayName,
  nanoTimestampToDate,
} from "../../lib/utils";
import type { Assignment, ScheduledClass, Subject } from "../../types";
import { AssignmentChip } from "./AssignmentChip";
import { ClassBlock } from "./ClassBlock";

// Calendar uses Mon-Sun (0=Mon, 6=Sun) ordering for week display
const WEEK_DAYS = [1, 2, 3, 4, 5, 6, 0] as const; // Mon..Sun

/** Returns true if two dates are on the same calendar day */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Given a week-start Monday date, return date objects for each day Mon-Sun */
function getWeekDates(weekStart: Date): Date[] {
  return WEEK_DAYS.map((offset) => {
    const d = new Date(weekStart);
    // weekStart is Monday (index 1). WEEK_DAYS[0]=1 → +0, [6]=0 → +6
    const diff = offset === 0 ? 6 : offset - 1;
    d.setDate(d.getDate() + diff);
    return d;
  });
}

interface WeekViewProps {
  weekStart: Date;
  classes: ScheduledClass[];
  assignments: Assignment[];
  subjects: Subject[];
  onDeleteClass: (id: bigint) => void;
}

export function WeekView({
  weekStart,
  classes,
  assignments,
  subjects,
  onDeleteClass,
}: WeekViewProps) {
  const subjectMap = new Map(subjects.map((s) => [String(s.id), s]));
  const today = new Date();
  const weekDates = getWeekDates(weekStart);

  return (
    <div
      className="grid grid-cols-7 gap-1.5 min-h-[400px]"
      data-ocid="week-view"
    >
      {weekDates.map((date) => {
        // JS getDay: 0=Sun..6=Sat. Backend stores 0=Sun..6=Sat
        const jsDay = date.getDay();
        const isToday = isSameDay(date, today);
        const dateKey = date.toISOString().slice(0, 10);

        const dayClasses = classes
          .filter((c) => Number(c.dayOfWeek) === jsDay)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        const dayAssignments = assignments.filter((a) => {
          const d = nanoTimestampToDate(a.deadline);
          return isSameDay(d, date) && !a.isComplete;
        });

        const overdueCount = dayAssignments.filter(
          (a) => deadlineUrgency(a.deadline) === "overdue",
        ).length;

        return (
          <div
            key={dateKey}
            data-ocid={`week-col-${jsDay}`}
            className={cn(
              "flex flex-col gap-1 rounded-lg border p-1.5 min-h-[160px]",
              isToday
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card/50",
            )}
          >
            {/* Day header */}
            <div
              className={cn(
                "text-center pb-1 border-b mb-1",
                isToday ? "border-primary/30" : "border-border",
              )}
            >
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  isToday ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="hidden sm:block">
                  {getDayName(jsDay).slice(0, 3)}
                </span>
                <span className="sm:hidden">
                  {getDayName(jsDay).slice(0, 1)}
                </span>
              </p>
              <p
                className={cn(
                  "text-sm font-bold font-display leading-tight",
                  isToday ? "text-primary" : "text-foreground",
                )}
              >
                {date.getDate()}
              </p>
            </div>

            {/* Classes */}
            <div className="flex flex-col gap-1">
              {dayClasses.map((cls) => (
                <ClassBlock
                  key={String(cls.id)}
                  cls={cls}
                  subject={subjectMap.get(String(cls.subjectId))}
                  onDelete={onDeleteClass}
                />
              ))}
            </div>

            {/* Assignment deadlines */}
            {dayAssignments.length > 0 && (
              <div className="mt-auto flex flex-col gap-0.5 pt-1 border-t border-border/50">
                {overdueCount > 0 && (
                  <p className="text-[9px] font-semibold text-destructive uppercase tracking-wider px-0.5">
                    Overdue
                  </p>
                )}
                {dayAssignments.slice(0, 3).map((a) => (
                  <AssignmentChip
                    key={String(a.id)}
                    assignment={a}
                    subject={subjectMap.get(String(a.subjectId))}
                  />
                ))}
                {dayAssignments.length > 3 && (
                  <p className="text-[10px] text-muted-foreground text-center py-0.5">
                    +{dayAssignments.length - 3} more
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
