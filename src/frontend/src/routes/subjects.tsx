import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SubjectCard } from "../components/subjects/SubjectCard";
import { SubjectDialog } from "../components/subjects/SubjectDialog";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  useAssignments,
  useDeleteSubject,
  useSubjects,
} from "../hooks/useBackend";
import type { Subject } from "../types";

export default function SubjectsPage() {
  const { data: subjects = [], isLoading } = useSubjects();
  const { data: assignments = [] } = useAssignments();
  const deleteMut = useDeleteSubject();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Subject | undefined>();

  const taskCountMap = new Map<string, number>();
  for (const a of assignments) {
    const key = String(a.subjectId);
    taskCountMap.set(key, (taskCountMap.get(key) ?? 0) + 1);
  }

  function openCreate() {
    setEditTarget(undefined);
    setDialogOpen(true);
  }

  function openEdit(s: Subject) {
    setEditTarget(s);
    setDialogOpen(true);
  }

  async function handleDelete(s: Subject) {
    if (
      !confirm(
        `Delete "${s.name}"? Assignments linked to this subject will remain.`,
      )
    )
      return;
    try {
      await deleteMut.mutateAsync(s.id);
      toast.success(`Deleted "${s.name}"`);
    } catch {
      toast.error("Failed to delete subject");
    }
  }

  return (
    <div
      data-ocid="subjects-page"
      className="flex flex-col gap-6 p-6 max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Subjects
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your courses, color coding, and weekly schedules
          </p>
        </div>
        <Button
          data-ocid="add-subject-btn"
          onClick={openCreate}
          className="gap-2"
        >
          <Plus className="size-4" />
          Add Subject
        </Button>
      </div>

      {/* Subject grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {["a", "b", "c"].map((k) => (
            <Card key={k} className="card-elevated">
              <CardContent className="pt-5 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div
          data-ocid="subjects-empty"
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
            <BookOpen className="size-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-lg">
              No subjects yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first subject to start organizing your studies with color
              coding
            </p>
          </div>
          <Button
            data-ocid="add-subject-empty-btn"
            onClick={openCreate}
            className="gap-2"
          >
            <Plus className="size-4" />
            Add your first subject
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((s) => (
            <SubjectCard
              key={String(s.id)}
              subject={s}
              taskCount={taskCountMap.get(String(s.id)) ?? 0}
              onEdit={() => openEdit(s)}
              onDelete={() => handleDelete(s)}
            />
          ))}
        </div>
      )}

      <SubjectDialog
        key={editTarget ? String(editTarget.id) : "new"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editTarget}
      />
    </div>
  );
}
