import { Timer } from "lucide-react";
import { cn, subjectColorToIndex } from "../../lib/utils";
import type { Assignment, PomodoroSession, Subject } from "../../types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SessionHistoryProps {
  sessions: PomodoroSession[];
  subjects: Subject[];
  assignments: Assignment[];
}

export function SessionHistory({
  sessions,
  subjects,
  assignments,
}: SessionHistoryProps) {
  const subjectMap = new Map(subjects.map((s) => [String(s.id), s]));
  const assignmentMap = new Map(assignments.map((a) => [String(a.id), a]));

  // Today's sessions first, then sort by completedAt desc, limit to 10
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  const todayMs = (s: PomodoroSession) =>
    Number(s.completedAt / 1_000_000n) >= todayStart;

  const sorted = sessions
    .slice()
    .sort((a, b) => Number(b.completedAt - a.completedAt))
    .slice(0, 10);

  const todayCount = sorted.filter(todayMs).length;

  return (
    <Card className="card-elevated flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Timer className="size-4 text-primary" />
            Recent Sessions
          </span>
          {todayCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {todayCount} today
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {sorted.length === 0 ? (
          <div
            data-ocid="sessions-empty"
            className="flex flex-col items-center gap-2 py-8 text-center"
          >
            <Timer className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
            <p className="text-xs text-muted-foreground/70">
              Start your first session above!
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {sorted.map((session) => {
              const subject = session.subjectId
                ? subjectMap.get(String(session.subjectId))
                : undefined;
              const assignment =
                session.assignmentId !== undefined
                  ? assignmentMap.get(String(session.assignmentId))
                  : undefined;
              const colorIdx = subject ? subjectColorToIndex(subject.color) : 1;
              const date = new Date(Number(session.completedAt / 1_000_000n));
              const isToday = date.getTime() >= todayStart;

              return (
                <div
                  key={String(session.id)}
                  data-ocid="session-row"
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 rounded-md transition-smooth",
                    isToday ? "hover:bg-primary/5" : "hover:bg-muted/40",
                  )}
                >
                  {/* Color dot */}
                  <span
                    className={cn(
                      "size-2 rounded-full flex-shrink-0",
                      subject
                        ? `bg-chart-${colorIdx}`
                        : "bg-muted-foreground/50",
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {subject?.name ?? "General study"}
                    </p>
                    {assignment && (
                      <p className="text-xs text-muted-foreground truncate">
                        {assignment.title}
                      </p>
                    )}
                    {!assignment && (
                      <p className="text-xs text-muted-foreground">
                        {isToday
                          ? `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
                          : date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={isToday ? "default" : "secondary"}
                    className="text-xs flex-shrink-0 tabular-nums"
                  >
                    {Number(session.durationMinutes)}m
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
