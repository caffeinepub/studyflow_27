import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer } from "lucide-react";
import {
  cn,
  formatMinutes,
  nanoTimestampToDate,
  subjectColorToIndex,
} from "../../lib/utils";
import type { PomodoroSession, Subject } from "../../types";

interface RecentSessionsProps {
  sessions: PomodoroSession[];
  subjectMap: Map<bigint, Subject>;
  isLoading?: boolean;
}

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

export function RecentSessions({
  sessions,
  subjectMap,
  isLoading,
}: RecentSessionsProps) {
  const recent = sessions
    .slice()
    .sort((a, b) => Number(b.completedAt - a.completedAt))
    .slice(0, 3);

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Timer className="size-4 text-primary" />
          Recent Focus Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2">
            {["r1", "r2", "r3"].map((k) => (
              <Skeleton key={k} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div
            data-ocid="no-sessions-empty"
            className="text-center py-8 text-muted-foreground"
          >
            <Timer className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No sessions yet</p>
            <p className="text-xs mt-1 opacity-70">
              Start a focus timer to log your first session.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((session) => {
              const subject = session.subjectId
                ? subjectMap.get(session.subjectId)
                : undefined;
              const colorIdx = subject ? subjectColorToIndex(subject.color) : 1;
              const startedDate = nanoTimestampToDate(session.completedAt);
              const duration = Number(session.durationMinutes);

              return (
                <div
                  key={String(session.id)}
                  data-ocid="session-row"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                    `subject-bg-${colorIdx}`,
                  )}
                >
                  <div
                    className={cn(
                      "size-2.5 rounded-full flex-shrink-0",
                      `bg-chart-${colorIdx}`,
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {subject?.name ?? "General Study"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(startedDate)}
                    </p>
                  </div>
                  <span className="text-sm font-mono font-medium text-foreground flex-shrink-0">
                    {formatMinutes(duration)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
