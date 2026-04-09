import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  formatMinutes,
  getDayName,
  subjectColorToIndex,
} from "../../lib/utils";
import type { ScheduledClass, Subject } from "../../types";

interface TodaysClassesProps {
  classes: ScheduledClass[];
  subjectMap: Map<bigint, Subject>;
  today: number;
}

interface ClassRowProps {
  label: string;
  time: string;
  duration: number;
  colorIdx: 1 | 2 | 3 | 4 | 5;
}

function ClassRow({ label, time, duration, colorIdx }: ClassRowProps) {
  return (
    <div
      data-ocid="todays-class-row"
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth hover:brightness-95",
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
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        <p className="text-xs text-muted-foreground">
          {time} · {formatMinutes(duration)}
        </p>
      </div>
    </div>
  );
}

export function TodaysClasses({
  classes,
  subjectMap,
  today,
}: TodaysClassesProps) {
  const todayClasses = classes
    .filter((c) => Number(c.dayOfWeek) === today)
    .slice()
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          Today · {getDayName(today)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {todayClasses.length === 0 ? (
          <div
            data-ocid="no-classes-empty"
            className="text-center py-8 text-muted-foreground"
          >
            <BookOpen className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No classes today</p>
            <p className="text-xs mt-1 opacity-70">
              Enjoy your free day or get ahead on assignments.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayClasses.map((cls) => {
              const subject = subjectMap.get(cls.subjectId);
              const colorIdx = subject
                ? subjectColorToIndex(subject.color)
                : (1 as 1 | 2 | 3 | 4 | 5);
              return (
                <ClassRow
                  key={String(cls.id)}
                  label={subject?.name ?? "Class"}
                  time={cls.startTime}
                  duration={Number(cls.durationMinutes)}
                  colorIdx={colorIdx}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
