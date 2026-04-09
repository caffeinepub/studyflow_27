import { cn, subjectColorToIndex } from "../../lib/utils";
import type { ScheduledClass, Subject } from "../../types";

interface ClassBlockProps {
  cls: ScheduledClass;
  subject: Subject | undefined;
  /** If true, renders as a time-positioned block in day view */
  timePositioned?: boolean;
  topPx?: number;
  heightPx?: number;
  onDelete?: (id: bigint) => void;
}

export function ClassBlock({
  cls,
  subject,
  timePositioned = false,
  topPx,
  heightPx,
  onDelete,
}: ClassBlockProps) {
  const colorIdx = subject ? subjectColorToIndex(subject.color) : 1;
  const name = subject?.name ?? "Class";
  const duration = Number(cls.durationMinutes);

  const base = cn(
    "group relative rounded-md border text-xs leading-tight overflow-hidden",
    `subject-bg-${colorIdx}`,
    `border-chart-${colorIdx}/30`,
  );

  if (timePositioned) {
    return (
      <div
        data-ocid="day-class-block"
        className={cn(base, "absolute left-1 right-1 px-2 py-1.5 min-h-[24px]")}
        style={{ top: topPx, height: heightPx }}
      >
        <p
          className={cn("font-semibold truncate", `subject-color-${colorIdx}`)}
        >
          {name}
        </p>
        <p className="text-muted-foreground truncate">
          {cls.startTime} · {duration}m
        </p>
        {onDelete && (
          <button
            type="button"
            data-ocid="day-delete-class-btn"
            onClick={() => onDelete(cls.id)}
            aria-label="Remove class"
            className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center size-4 rounded bg-card/80 text-muted-foreground hover:text-destructive transition-colors"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div data-ocid="week-class-block" className={cn(base, "px-1.5 py-1")}>
      <p className={cn("font-medium truncate", `subject-color-${colorIdx}`)}>
        {name}
      </p>
      <p className="text-muted-foreground truncate">{cls.startTime}</p>
      <p className="text-muted-foreground/70 truncate">{duration}m</p>
      {onDelete && (
        <button
          type="button"
          data-ocid="week-delete-class-btn"
          onClick={() => onDelete(cls.id)}
          aria-label="Remove class"
          className="absolute top-0.5 right-0.5 hidden group-hover:flex items-center justify-center size-4 rounded bg-card/80 text-muted-foreground hover:text-destructive transition-colors text-base leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
