import { useState } from "react";
import { toast } from "sonner";
import { useCreateScheduledClass } from "../../hooks/useBackend";
import type { SubjectId } from "../../types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const DAY_OPTIONS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subjectId: SubjectId;
  subjectName: string;
}

export function ClassDialog({
  open,
  onOpenChange,
  subjectId,
  subjectName,
}: ClassDialogProps) {
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const createMut = useCreateScheduledClass();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mins = Number.parseInt(durationMinutes, 10);
    if (!startTime || Number.isNaN(mins) || mins < 5) return;
    try {
      await createMut.mutateAsync({
        subjectId,
        dayOfWeek: Number.parseInt(dayOfWeek, 10),
        startTime,
        durationMinutes: mins,
      });
      toast.success("Class scheduled");
      onOpenChange(false);
      setDayOfWeek("1");
      setStartTime("09:00");
      setDurationMinutes("60");
    } catch {
      toast.error("Failed to schedule class");
    }
  }

  const isValid =
    !!startTime &&
    !Number.isNaN(Number.parseInt(durationMinutes, 10)) &&
    Number.parseInt(durationMinutes, 10) >= 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">
            Schedule Class
            <span className="block text-sm font-normal text-muted-foreground mt-0.5">
              {subjectName}
            </span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="class-day">Day of week</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger id="class-day" data-ocid="class-day-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_OPTIONS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="class-time">Start time</Label>
              <Input
                id="class-time"
                data-ocid="class-time-input"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="class-duration">Duration (min)</Label>
              <Input
                id="class-duration"
                data-ocid="class-duration-input"
                type="number"
                min={5}
                max={480}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMut.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="class-save-btn"
              disabled={!isValid || createMut.isPending}
            >
              Schedule class
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
