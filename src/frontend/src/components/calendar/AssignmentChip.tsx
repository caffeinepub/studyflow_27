import { useState } from "react";
import {
  cn,
  deadlineUrgency,
  formatDeadline,
  subjectColorToIndex,
} from "../../lib/utils";
import type { Assignment, Subject } from "../../types";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const TYPE_LABELS: Record<string, string> = {
  Homework: "HW",
  Exam: "Exam",
  Project: "Proj",
  Quiz: "Quiz",
  Essay: "Essay",
  Lab: "Lab",
  Presentation: "Pres",
  Other: "Other",
};

interface AssignmentChipProps {
  assignment: Assignment;
  subject: Subject | undefined;
}

export function AssignmentChip({ assignment, subject }: AssignmentChipProps) {
  const [open, setOpen] = useState(false);
  const colorIdx = subject ? subjectColorToIndex(subject.color) : 1;
  const urgency = deadlineUrgency(assignment.deadline);
  const isOverdue = urgency === "overdue";

  const typeKey =
    typeof assignment.assignmentType === "object"
      ? Object.keys(assignment.assignmentType)[0]
      : String(assignment.assignmentType);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-ocid="assignment-chip"
          className={cn(
            "w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-xs text-left border-l-2 transition-colors",
            "bg-muted/50 hover:bg-muted border-l-chart-1",
            isOverdue ? "border-l-destructive" : `border-l-chart-${colorIdx}`,
          )}
        >
          <span className="flex-1 truncate min-w-0 text-foreground font-medium">
            {assignment.title}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1 py-0 flex-shrink-0 h-4",
              isOverdue && "border-destructive text-destructive",
            )}
          >
            {TYPE_LABELS[typeKey] ?? typeKey}
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="w-64 p-3 space-y-2"
        data-ocid="assignment-chip-popover"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-snug text-foreground">
            {assignment.title}
          </p>
          <Badge variant="secondary" className="text-[10px] flex-shrink-0">
            {typeKey}
          </Badge>
        </div>

        {subject && (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "size-2 rounded-full flex-shrink-0",
                `bg-chart-${colorIdx}`,
              )}
            />
            <span className="text-xs text-muted-foreground">
              {subject.name}
            </span>
          </div>
        )}

        {assignment.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {assignment.description}
          </p>
        )}

        <div
          className={cn(
            "text-xs font-medium",
            isOverdue
              ? "text-destructive"
              : urgency === "urgent"
                ? "text-accent"
                : "text-muted-foreground",
          )}
        >
          {formatDeadline(assignment.deadline)}
        </div>

        {assignment.isComplete && (
          <Badge className="text-[10px] bg-chart-2/20 text-chart-2 border-chart-2/30">
            Completed
          </Badge>
        )}
      </PopoverContent>
    </Popover>
  );
}
