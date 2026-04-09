import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AssignmentType,
  Priority,
  useCreateAssignment,
  useUpdateAssignment,
} from "../../hooks/useBackend";
import { nanoTimestampToDate } from "../../lib/utils";
import type { Assignment, AssignmentId, Subject } from "../../types";
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
import { Textarea } from "../ui/textarea";

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subjects: Subject[];
  /** When provided, the dialog is in edit mode */
  editAssignment?: Assignment;
}

function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AssignmentDialog({
  open,
  onOpenChange,
  subjects,
  editAssignment,
}: AssignmentDialogProps) {
  const isEdit = !!editAssignment;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState<AssignmentType>(AssignmentType.assignment);
  const [priority, setPriority] = useState<Priority>(Priority.medium);

  const createMut = useCreateAssignment();
  const updateMut = useUpdateAssignment();

  // Populate fields when editing
  useEffect(() => {
    if (editAssignment) {
      setTitle(editAssignment.title);
      setDescription(editAssignment.description);
      setSubjectId(String(editAssignment.subjectId));
      setDeadline(
        toDateInputValue(nanoTimestampToDate(editAssignment.deadline)),
      );
      setType(editAssignment.assignmentType);
      setPriority(editAssignment.priority);
    } else {
      setTitle("");
      setDescription("");
      setSubjectId("");
      setDeadline("");
      setType(AssignmentType.assignment);
      setPriority(Priority.medium);
    }
  }, [editAssignment]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !subjectId || !deadline) return;

    try {
      if (isEdit && editAssignment) {
        await updateMut.mutateAsync({
          id: editAssignment.id as AssignmentId,
          title: title.trim(),
          description: description.trim(),
          deadline: new Date(deadline),
          assignmentType: type,
          priority,
        });
        toast.success("Assignment updated");
      } else {
        const sub = subjects.find((s) => String(s.id) === subjectId);
        if (!sub) return;
        await createMut.mutateAsync({
          subjectId: sub.id,
          title: title.trim(),
          description: description.trim(),
          deadline: new Date(deadline),
          assignmentType: type,
          priority,
        });
        toast.success("Assignment created");
      }
      onOpenChange(false);
    } catch {
      toast.error(
        isEdit ? "Failed to update assignment" : "Failed to create assignment",
      );
    }
  }

  const isPending = createMut.isPending || updateMut.isPending;
  const isValid = title.trim() && subjectId && deadline;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Assignment" : "New Assignment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="asgn-title">Title</Label>
            <Input
              id="asgn-title"
              data-ocid="assignment-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 Essay"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger data-ocid="assignment-subject-select">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={String(s.id)} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as AssignmentType)}
              >
                <SelectTrigger data-ocid="assignment-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AssignmentType.assignment}>
                    Assignment
                  </SelectItem>
                  <SelectItem value={AssignmentType.exam}>Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="asgn-deadline">Deadline</Label>
              <Input
                id="asgn-deadline"
                data-ocid="assignment-deadline-input"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}
              >
                <SelectTrigger data-ocid="assignment-priority-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Priority.high}>High</SelectItem>
                  <SelectItem value={Priority.medium}>Medium</SelectItem>
                  <SelectItem value={Priority.low}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="asgn-desc">Description (optional)</Label>
            <Textarea
              id="asgn-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes, instructions..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="assignment-save-btn"
              disabled={!isValid || isPending}
            >
              {isEdit ? "Save changes" : "Create assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
