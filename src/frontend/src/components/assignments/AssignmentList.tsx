import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";
import { AssignmentType, Priority } from "../../hooks/useBackend";
import {
  cn,
  deadlineUrgency,
  formatDeadline,
  formatMinutes,
  subjectColorToIndex,
} from "../../lib/utils";
import type { Assignment, Subject } from "../../types";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.high]: "High",
  [Priority.medium]: "Medium",
  [Priority.low]: "Low",
};

const PRIORITY_BADGE: Record<Priority, string> = {
  [Priority.high]: "bg-destructive/10 text-destructive border-destructive/20",
  [Priority.medium]: "bg-accent/10 text-accent-foreground border-accent/30",
  [Priority.low]: "bg-muted text-muted-foreground border-border",
};

interface AssignmentRowProps {
  assignment: Assignment;
  subject: Subject | undefined;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function AssignmentRow({
  assignment,
  subject,
  onComplete,
  onEdit,
  onDelete,
}: AssignmentRowProps) {
  const urgency = deadlineUrgency(assignment.deadline);
  const colorIdx = subject ? subjectColorToIndex(subject.color) : 1;
  const minutesStudied = Number(assignment.totalMinutesStudied);

  return (
    <div
      data-ocid="assignment-item"
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card",
        "hover:bg-muted/30 transition-smooth group",
        assignment.isComplete && "opacity-60",
      )}
    >
      {/* Complete toggle */}
      <button
        type="button"
        data-ocid="complete-toggle"
        onClick={onComplete}
        aria-label={assignment.isComplete ? "Mark incomplete" : "Mark complete"}
        className="mt-0.5 flex-shrink-0"
        disabled={assignment.isComplete}
      >
        {assignment.isComplete ? (
          <CheckCircle2 className={`size-5 text-chart-${colorIdx}`} />
        ) : (
          <Circle className="size-5 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>

      {/* Subject color bar */}
      <div
        className={cn(
          "w-1 self-stretch rounded-full flex-shrink-0 mt-0.5",
          `bg-chart-${colorIdx}`,
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-medium text-foreground text-sm",
              assignment.isComplete && "line-through text-muted-foreground",
            )}
          >
            {assignment.title}
          </p>
          <div className="flex gap-1.5 flex-shrink-0 items-center">
            <Badge
              variant="outline"
              className={cn(
                "text-xs border",
                PRIORITY_BADGE[assignment.priority],
              )}
            >
              {PRIORITY_LABELS[assignment.priority]}
            </Badge>
            {assignment.assignmentType === AssignmentType.exam && (
              <Badge className="text-xs bg-primary/10 text-primary border-primary/20 border">
                Exam
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {subject && (
            <span
              className={cn("text-xs font-medium flex items-center gap-1.5")}
            >
              <span
                className={cn(
                  "size-2 rounded-full flex-shrink-0",
                  `bg-chart-${colorIdx}`,
                )}
              />
              <span className="text-muted-foreground">{subject.name}</span>
            </span>
          )}
          <span
            className={cn(
              "text-xs font-medium",
              urgency === "overdue"
                ? "text-destructive"
                : urgency === "urgent"
                  ? "text-accent-foreground"
                  : "text-muted-foreground",
            )}
          >
            {formatDeadline(assignment.deadline)}
          </span>
          {minutesStudied > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="opacity-60">·</span>
              {formatMinutes(minutesStudied)} studied
            </span>
          )}
        </div>

        {assignment.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {assignment.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-smooth">
        <button
          type="button"
          data-ocid="assignment-edit-btn"
          onClick={onEdit}
          aria-label="Edit assignment"
          className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          type="button"
          data-ocid="assignment-delete-btn"
          onClick={onDelete}
          aria-label="Delete assignment"
          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

interface AssignmentListProps {
  assignments: Assignment[];
  subjectMap: Map<string, Subject>;
  isLoading: boolean;
  statusFilter: string;
  onComplete: (a: Assignment) => void;
  onEdit: (a: Assignment) => void;
  onDelete: (a: Assignment) => void;
}

export function AssignmentList({
  assignments,
  subjectMap,
  isLoading,
  statusFilter,
  onComplete,
  onEdit,
  onDelete,
}: AssignmentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {["a", "b", "c", "d"].map((k) => (
          <Skeleton key={k} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div
        data-ocid="assignments-empty"
        className="text-center py-14 text-muted-foreground"
      >
        <CheckCircle2 className="size-10 mx-auto mb-3 opacity-20" />
        <p className="font-medium text-foreground">No assignments here</p>
        <p className="text-sm mt-1">
          {statusFilter === "pending"
            ? "You're all caught up! Add a new assignment above."
            : statusFilter === "completed"
              ? "No completed assignments yet."
              : "No assignments match this filter."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {assignments.map((a) => (
        <AssignmentRow
          key={String(a.id)}
          assignment={a}
          subject={subjectMap.get(String(a.subjectId))}
          onComplete={() => onComplete(a)}
          onEdit={() => onEdit(a)}
          onDelete={() => onDelete(a)}
        />
      ))}
    </div>
  );
}
