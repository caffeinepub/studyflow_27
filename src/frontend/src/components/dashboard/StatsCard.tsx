import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { cn } from "../../lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  colorClass: string;
  isLoading?: boolean;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  sub,
  colorClass,
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="card-elevated">
        <CardContent className="pt-5 pb-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-7 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground font-body">{label}</p>
            <p className="text-2xl font-display font-bold text-foreground mt-0.5">
              {value}
            </p>
            {sub && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {sub}
              </p>
            )}
          </div>
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center flex-shrink-0",
              colorClass,
            )}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CompletionCardProps {
  rate: number;
  isLoading?: boolean;
}

export function CompletionCard({ rate, isLoading }: CompletionCardProps) {
  const chartData = [{ value: rate, fill: "var(--color-chart-2)" }];

  if (isLoading) {
    return (
      <Card className="card-elevated">
        <CardContent className="pt-5 pb-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-7 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground font-body">
              Completion rate
            </p>
            <p className="text-2xl font-display font-bold text-foreground mt-0.5">
              {rate}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              assignments done
            </p>
          </div>
          <div className="size-14 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="60%"
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={90 - (rate / 100) * 360}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={4}
                  background={{ fill: "oklch(var(--muted))" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
