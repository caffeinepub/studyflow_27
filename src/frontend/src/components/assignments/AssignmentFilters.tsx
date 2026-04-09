import { Filter } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Subject } from "../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type StatusFilter = "all" | "pending" | "completed" | "exam";

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "exam", label: "Exams" },
];

interface AssignmentFiltersProps {
  statusFilter: StatusFilter;
  onStatusChange: (f: StatusFilter) => void;
  subjectFilter: string;
  onSubjectChange: (id: string) => void;
  subjects: Subject[];
}

export function AssignmentFilters({
  statusFilter,
  onStatusChange,
  subjectFilter,
  onSubjectChange,
  subjects,
}: AssignmentFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status pill tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            data-ocid={`filter-${f.key}`}
            onClick={() => onStatusChange(f.key)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-smooth",
              statusFilter === f.key
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Subject dropdown */}
      {subjects.length > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={subjectFilter} onValueChange={onSubjectChange}>
            <SelectTrigger
              data-ocid="subject-filter-select"
              className="w-40 h-9"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={String(s.id)} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
