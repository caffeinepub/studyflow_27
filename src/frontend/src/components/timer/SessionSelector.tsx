import type { Assignment, Subject } from "../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SessionSelectorProps {
  subjects: Subject[];
  assignments: Assignment[];
  selectedSubjectId: string;
  selectedAssignmentId: string;
  disabled: boolean;
  onSubjectChange: (id: string) => void;
  onAssignmentChange: (id: string) => void;
}

export function SessionSelector({
  subjects,
  assignments,
  selectedSubjectId,
  selectedAssignmentId,
  disabled,
  onSubjectChange,
  onAssignmentChange,
}: SessionSelectorProps) {
  const pendingAssignments = assignments.filter((a) => !a.isComplete);
  const filteredAssignments =
    selectedSubjectId !== "none"
      ? pendingAssignments.filter(
          (a) => String(a.subjectId) === selectedSubjectId,
        )
      : pendingAssignments;

  return (
    <div className="w-full grid grid-cols-2 gap-3 max-w-sm">
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground font-medium">Subject</p>
        <Select
          value={selectedSubjectId}
          onValueChange={(v) => {
            onSubjectChange(v);
            onAssignmentChange("none");
          }}
          disabled={disabled}
        >
          <SelectTrigger
            data-ocid="timer-subject-select"
            className="h-9 text-sm"
          >
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={String(s.id)} value={String(s.id)}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground font-medium">Assignment</p>
        <Select
          value={selectedAssignmentId}
          onValueChange={onAssignmentChange}
          disabled={disabled}
        >
          <SelectTrigger
            data-ocid="timer-assignment-select"
            className="h-9 text-sm"
          >
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {filteredAssignments.map((a) => (
              <SelectItem key={String(a.id)} value={String(a.id)}>
                {a.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
