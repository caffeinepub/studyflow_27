import {
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteScheduledClass,
  useScheduledClasses,
} from "../../hooks/useBackend";
import {
  COLOR_OPTIONS,
  cn,
  formatMinutes,
  getDayName,
  subjectColorToIndex,
} from "../../lib/utils";
import type { Subject } from "../../types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ClassDialog } from "./ClassDialog";

interface SubjectCardProps {
  subject: Subject;
  taskCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

function ClassesSection({ subject }: { subject: Subject }) {
  const { data: allClasses = [], isLoading } = useScheduledClasses();
  const deleteMut = useDeleteScheduledClass();
  const [addOpen, setAddOpen] = useState(false);

  const classes = allClasses.filter(
    (c) => String(c.subjectId) === String(subject.id),
  );

  async function handleDeleteClass(classId: bigint) {
    try {
      await deleteMut.mutateAsync(classId);
      toast.success("Class removed");
    } catch {
      toast.error("Failed to remove class");
    }
  }

  const colorIdx = subjectColorToIndex(subject.color);

  return (
    <div className="border-t border-border pt-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Weekly schedule
        </span>
        <Button
          variant="ghost"
          size="sm"
          data-ocid="add-class-btn"
          onClick={() => setAddOpen(true)}
          className="h-6 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-3" />
          Add class
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-1.5 px-1">
          {["a", "b"].map((k) => (
            <Skeleton key={k} className="h-8 w-full rounded-md" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div
          data-ocid="classes-empty"
          className="flex flex-col items-center gap-1 py-4 text-center"
        >
          <Clock className="size-5 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">No classes scheduled</p>
        </div>
      ) : (
        <ul className="space-y-1.5 px-1">
          {classes.map((cls) => (
            <li
              key={String(cls.id)}
              data-ocid="class-item"
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 group/cls",
                `subject-bg-${colorIdx}`,
              )}
            >
              <span className="text-xs font-medium min-w-0 flex-1 truncate">
                <span
                  className={cn("font-semibold", `subject-color-${colorIdx}`)}
                >
                  {getDayName(Number(cls.dayOfWeek))}
                </span>
                <span className="text-muted-foreground ml-1">
                  {cls.startTime} · {formatMinutes(Number(cls.durationMinutes))}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                data-ocid="delete-class-btn"
                aria-label="Remove class"
                onClick={() => handleDeleteClass(cls.id)}
                className="size-6 p-0 opacity-0 group-hover/cls:opacity-100 transition-smooth text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ClassDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        subjectId={subject.id}
        subjectName={subject.name}
      />
    </div>
  );
}

export function SubjectCard({
  subject,
  taskCount,
  onEdit,
  onDelete,
}: SubjectCardProps) {
  const colorIdx = subjectColorToIndex(subject.color);
  const colorOpt =
    COLOR_OPTIONS.find((o) => o.value === subject.color) ?? COLOR_OPTIONS[0];
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      data-ocid="subject-card"
      className={cn(
        "card-elevated transition-smooth group flex flex-col",
        "border-l-4",
        `border-l-chart-${colorIdx}`,
      )}
    >
      {/* Color banner strip */}
      <div
        className={cn(
          "h-1.5 w-full rounded-t-md -mt-px",
          `subject-bg-${colorIdx}`,
        )}
      />

      <CardHeader className="pb-2 pt-4">
        <CardTitle className="font-display text-base flex items-center gap-2.5">
          <span
            className={cn(
              "size-3.5 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-card",
              colorOpt.ring.replace("ring-", "ring-"),
              `bg-chart-${colorIdx}`,
            )}
          />
          <span className="truncate min-w-0">{subject.name}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3 flex-1 space-y-2">
        <Badge
          variant="secondary"
          className={cn(
            "border-0 text-xs",
            `subject-bg-${colorIdx}`,
            `subject-color-${colorIdx}`,
          )}
        >
          {taskCount} {taskCount === 1 ? "assignment" : "assignments"}
        </Badge>

        {/* Expandable classes toggle */}
        <button
          type="button"
          data-ocid="expand-classes-btn"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          {expanded ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
          {expanded ? "Hide schedule" : "Show schedule"}
        </button>

        {expanded && <ClassesSection subject={subject} />}
      </CardContent>

      <CardFooter className="pt-0 flex gap-2 border-t border-border mt-auto">
        <Button
          variant="ghost"
          size="sm"
          data-ocid="subject-edit-btn"
          onClick={onEdit}
          className="flex-1 gap-1.5 text-xs h-8"
        >
          <Edit2 className="size-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          data-ocid="subject-delete-btn"
          onClick={onDelete}
          className="flex-1 gap-1.5 text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
