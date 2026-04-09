import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { BookOpen, Clock, Flame, Plus, TrendingUp } from "lucide-react";
import { RecentSessions } from "../components/dashboard/RecentSessions";
import { CompletionCard, StatsCard } from "../components/dashboard/StatsCard";
import { TodaysClasses } from "../components/dashboard/TodaysClasses";
import { UpcomingDeadlines } from "../components/dashboard/UpcomingDeadlines";
import {
  useAssignments,
  usePomodoroSessions,
  useScheduledClasses,
  useStudyStats,
  useSubjects,
} from "../hooks/useBackend";
import { deadlineUrgency, formatMinutes, getDayName } from "../lib/utils";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStudyStats();
  const { data: assignments = [], isLoading: assignLoading } = useAssignments();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: classes = [] } = useScheduledClasses();
  const { data: sessions = [], isLoading: sessionsLoading } =
    usePomodoroSessions();

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  const today = new Date().getDay();
  const totalMins = stats ? Number(stats.totalMinutesThisWeek) : 0;
  const completionRate = stats ? Number(stats.completionRatePercent) : 0;
  const sessionsToday = stats ? Number(stats.sessionsToday) : 0;
  const overdueCount = assignments.filter(
    (a) => !a.isComplete && deadlineUrgency(a.deadline) === "overdue",
  ).length;

  const isStatsLoading = statsLoading || subjectsLoading;

  return (
    <div
      data-ocid="dashboard-page"
      className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1200px] mx-auto w-full"
    >
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Good {getGreeting()}, ready to study?
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {overdueCount > 0 && (
            <Badge
              variant="destructive"
              data-ocid="overdue-badge"
              className="gap-1.5"
            >
              <Flame className="size-3.5" />
              {overdueCount} overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Quick-add shortcuts */}
      <div className="flex flex-wrap gap-2">
        <Link to="/assignments">
          <Button
            variant="outline"
            size="sm"
            data-ocid="quick-add-assignment"
            className="gap-1.5 text-sm"
          >
            <Plus className="size-3.5" />
            New Assignment
          </Button>
        </Link>
        <Link to="/subjects">
          <Button
            variant="outline"
            size="sm"
            data-ocid="quick-add-subject"
            className="gap-1.5 text-sm"
          >
            <Plus className="size-3.5" />
            New Subject
          </Button>
        </Link>
        <Link to="/timer">
          <Button
            variant="outline"
            size="sm"
            data-ocid="start-timer-shortcut"
            className="gap-1.5 text-sm"
          >
            <Clock className="size-3.5" />
            Start Timer
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isStatsLoading ? (
          ["s1", "s2", "s3", "s4"].map((k) => (
            <Card key={k} className="card-elevated">
              <CardContent className="pt-5 pb-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-7 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              icon={Clock}
              label="Study time this week"
              value={formatMinutes(totalMins)}
              sub="across all subjects"
              colorClass="bg-primary/10 text-primary"
            />
            <CompletionCard rate={completionRate} />
            <StatsCard
              icon={TrendingUp}
              label="Sessions today"
              value={String(sessionsToday)}
              sub="pomodoro sessions"
              colorClass="bg-chart-3/10 text-chart-3"
            />
            <StatsCard
              icon={BookOpen}
              label="Subjects"
              value={String(subjects.length)}
              sub={`${assignments.filter((a) => !a.isComplete).length} open tasks`}
              colorClass="bg-chart-4/10 text-chart-4"
            />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingDeadlines
          assignments={assignments}
          subjectMap={subjectMap}
          isLoading={assignLoading}
        />
        <TodaysClasses
          classes={classes}
          subjectMap={subjectMap}
          today={today}
        />
      </div>

      {/* Recent sessions — full width */}
      <RecentSessions
        sessions={sessions}
        subjectMap={subjectMap}
        isLoading={sessionsLoading}
      />
    </div>
  );
}
