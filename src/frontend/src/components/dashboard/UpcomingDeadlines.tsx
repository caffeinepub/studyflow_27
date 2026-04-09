import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Plus } from "lucide-react";
import {
  cn,
  deadlineUrgency,
  formatDeadline,
  subjectColorToIndex,
} from "../../lib/utils";
import type { Assignment, Subject } from "../../types";

interface UpcomingDeadlinesProps {
  assignments: Assignment[];
  subjectMap: Map<bigint, Subject>;
  isLoading?: boolean;
}

const urgencyStyles = {
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  urgent: "bg-accent/10 text-accent border-accent/20",
  soon: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  normal: "bg-muted text-muted-foreground border-border",
} as const;

interface DeadlineRowProps {
  assignment: Assignment;
  subject: Subject | undefined;
}

function DeadlineRow({ assignment, subject }: DeadlineRowProps) {
  const urgency = deadlineUrgency(assignment.deadline);
  const colorIdx = subject ? subjectColorToIndex(subject.color) : 1;

  return (
    <div
      data-ocid="deadline-row"
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth hover:bg-muted/50",
        assignment.isComplete && "opacity-50",
      )}
    >
      <div
        className={cn(
          "size-2.5 rounded-full flex-shrink-0",
          `bg-chart-${colorIdx}`,
        )}
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-foreground truncate",
            assignment.isComplete && "line-through",
          )}
        >
          {assignment.title}
        </p>
        {subject && (
          <p className="text-xs text-muted-foreground truncate">
            {subject.name}
          </p>
        )}
      </div>
      <Badge
        variant="outline"
        className={cn("text-xs flex-shrink-0 border", urgencyStyles[urgency])}
      >
        {formatDeadline(assignment.deadline)}
      </Badge>
    </div>
  );
}

export function UpcomingDeadlines({
  assignments,
  subjectMap,
  isLoading,
}: UpcomingDeadlinesProps) {
  const upcoming = assignments
    .filter((a) => !a.isComplete)
    .sort((a, b) => Number(a.deadline - b.deadline))
    .slice(0, 5);

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Upcoming Deadlines
          </CardTitle>
          <Link to="/assignments">
            <Button
              variant="ghost"
              size="sm"
              data-ocid="new-assignment-shortcut"
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="size-3.5" />
              New
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {["sa", "sb", "sc", "sd"].map((k) => (
              <Skeleton key={k} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div
            data-ocid="no-assignments-empty"
            className="text-center py-8 text-muted-foreground"
          >
            <CheckCircle2 className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs mt-1 opacity-70">
              No pending assignments due.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {upcoming.map((a) => (
              <DeadlineRow
                key={String(a.id)}
                assignment={a}
                subject={subjectMap.get(a.subjectId)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
