import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AssignmentDialog } from "../components/assignments/AssignmentDialog";
import {
  AssignmentFilters,
  type StatusFilter,
} from "../components/assignments/AssignmentFilters";
import { AssignmentList } from "../components/assignments/AssignmentList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  AssignmentType,
  useAssignments,
  useDeleteAssignment,
  useMarkAssignmentComplete,
  useSubjects,
} from "../hooks/useBackend";
import type { Assignment } from "../types";

export default function AssignmentsPage() {
  const { data: assignments = [], isLoading } = useAssignments();
  const { data: subjects = [] } = useSubjects();
  const completeMut = useMarkAssignmentComplete();
  const deleteMut = useDeleteAssignment();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Assignment | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Assignment | undefined>();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const subjectMap = new Map(subjects.map((s) => [String(s.id), s]));

  const filtered = assignments
    .filter((a) => {
      if (statusFilter === "pending") return !a.isComplete;
      if (statusFilter === "completed") return a.isComplete;
      if (statusFilter === "exam")
        return a.assignmentType === AssignmentType.exam;
      return true;
    })
    .filter(
      (a) => subjectFilter === "all" || String(a.subjectId) === subjectFilter,
    )
    .sort((a, b) => {
      if (a.isComplete !== b.isComplete) return a.isComplete ? 1 : -1;
      return Number(a.deadline - b.deadline);
    });

  const pending = assignments.filter((a) => !a.isComplete).length;
  const overdue = assignments.filter((a) => {
    if (a.isComplete) return false;
    return Number(a.deadline) < Date.now() * 1_000_000;
  }).length;

  async function handleComplete(a: Assignment) {
    try {
      await completeMut.mutateAsync(a.id);
      toast.success("Marked as complete");
    } catch {
      toast.error("Failed to update assignment");
    }
  }

  function handleEdit(a: Assignment) {
    setEditTarget(a);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditTarget(undefined);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget.id);
      toast.success("Assignment deleted");
    } catch {
      toast.error("Failed to delete assignment");
    } finally {
      setDeleteTarget(undefined);
    }
  }

  return (
    <div
      data-ocid="assignments-page"
      className="flex flex-col gap-6 p-6 max-w-[900px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Assignments
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pending > 0 ? (
              <>
                <span className="font-medium text-foreground">{pending}</span>{" "}
                pending
                {overdue > 0 && (
                  <>
                    {" · "}
                    <span className="font-medium text-destructive">
                      {overdue} overdue
                    </span>
                  </>
                )}
              </>
            ) : (
              "All caught up! 🎉"
            )}
          </p>
        </div>
        <Button
          data-ocid="add-assignment-btn"
          onClick={() => {
            setEditTarget(undefined);
            setDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="size-4" />
          Add Assignment
        </Button>
      </div>

      {/* Filters */}
      <AssignmentFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        subjectFilter={subjectFilter}
        onSubjectChange={setSubjectFilter}
        subjects={subjects}
      />

      {/* Assignment list */}
      <Card className="card-elevated">
        <CardHeader className="pb-0 pt-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {filtered.length}{" "}
            {filtered.length === 1 ? "assignment" : "assignments"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <AssignmentList
            assignments={filtered}
            subjectMap={subjectMap}
            isLoading={isLoading}
            statusFilter={statusFilter}
            onComplete={handleComplete}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <AssignmentDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        subjects={subjects}
        editAssignment={editTarget}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be permanently removed. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="delete-cancel-btn">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="delete-confirm-btn"
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
