import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateSubject, useUpdateSubject } from "../../hooks/useBackend";
import { COLOR_OPTIONS, cn } from "../../lib/utils";
import type { Subject } from "../../types";
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

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-label={opt.label}
          title={opt.label}
          onClick={() => onChange(opt.value)}
          className={cn(
            "size-9 rounded-full transition-smooth border-2 flex items-center justify-center",
            opt.bg,
            value === opt.value
              ? `${opt.ring} ring-2 ring-offset-2 ring-offset-background border-transparent scale-110`
              : "border-border hover:scale-105",
          )}
        >
          {value === opt.value && (
            <span
              className={cn(
                "size-3 rounded-full",
                `bg-chart-${opt.value.replace("chart-", "")}`,
              )}
            />
          )}
        </button>
      ))}
    </div>
  );
}

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Subject;
}

export function SubjectDialog({
  open,
  onOpenChange,
  initial,
}: SubjectDialogProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? "chart-1");

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setColor(initial?.color ?? "chart-1");
    }
  }, [open, initial]);

  const createMut = useCreateSubject();
  const updateMut = useUpdateSubject();
  const isLoading = createMut.isPending || updateMut.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      if (initial) {
        await updateMut.mutateAsync({
          id: initial.id,
          name: name.trim(),
          color,
        });
        toast.success("Subject updated");
      } else {
        await createMut.mutateAsync({ name: name.trim(), color });
        toast.success("Subject created");
      }
      onOpenChange(false);
    } catch {
      toast.error("Failed to save subject");
    }
  }

  const selectedOpt = COLOR_OPTIONS.find((o) => o.value === color);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            {selectedOpt && (
              <span
                className={cn(
                  "size-4 rounded-full flex-shrink-0",
                  selectedOpt.bg.replace("/20", ""),
                )}
              />
            )}
            {initial ? "Edit Subject" : "New Subject"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="subject-name">Subject name</Label>
            <Input
              id="subject-name"
              data-ocid="subject-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mathematics"
              autoFocus
              maxLength={60}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="p-3 rounded-lg bg-muted/40 border border-border">
              <ColorPicker value={color} onChange={setColor} />
              <p className="text-xs text-muted-foreground mt-2">
                {selectedOpt?.label ?? ""}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="subject-save-btn"
              disabled={!name.trim() || isLoading}
            >
              {initial ? "Save changes" : "Create subject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
