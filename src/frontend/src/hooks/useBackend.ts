import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssignmentType, Priority, createActor } from "../backend";
import { dateToNanoTimestamp } from "../lib/utils";
import type {
  Assignment,
  AssignmentId,
  CreateAssignmentInput,
  CreateClassInput,
  CreateSubjectInput,
  LogSessionInput,
  PomodoroSession,
  ScheduledClass,
  StudyStats,
  Subject,
  SubjectId,
} from "../types";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  subjects: ["subjects"] as const,
  assignments: ["assignments"] as const,
  scheduledClasses: ["scheduled-classes"] as const,
  pomodoroSessions: ["pomodoro-sessions"] as const,
  studyStats: ["study-stats"] as const,
};

// ─── Subjects ─────────────────────────────────────────────────────────────
export function useSubjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Subject[]>({
    queryKey: QUERY_KEYS.subjects,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSubject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Subject, Error, CreateSubjectInput>({
    mutationFn: async ({ name, color }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createSubject(name, color);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.subjects });
    },
  });
}

export function useUpdateSubject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    boolean,
    Error,
    { id: SubjectId; name: string; color: string }
  >({
    mutationFn: async ({ id, name, color }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSubject(id, name, color);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.subjects });
    },
  });
}

export function useDeleteSubject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, SubjectId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteSubject(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.subjects });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
    },
  });
}

// ─── Assignments ─────────────────────────────────────────────────────────────
export function useAssignments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Assignment[]>({
    queryKey: QUERY_KEYS.assignments,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssignments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAssignment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<Assignment, Error, CreateAssignmentInput>({
    mutationFn: async ({
      subjectId,
      title,
      description,
      deadline,
      assignmentType,
      priority,
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createAssignment(
        subjectId,
        title,
        description,
        dateToNanoTimestamp(deadline),
        assignmentType,
        priority,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.studyStats });
    },
  });
}

export function useUpdateAssignment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<
    boolean,
    Error,
    {
      id: AssignmentId;
      title: string;
      description: string;
      deadline: Date;
      assignmentType: AssignmentType;
      priority: Priority;
    }
  >({
    mutationFn: async ({
      id,
      title,
      description,
      deadline,
      assignmentType,
      priority,
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateAssignment(
        id,
        title,
        description,
        dateToNanoTimestamp(deadline),
        assignmentType,
        priority,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
    },
  });
}

export function useDeleteAssignment() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, AssignmentId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAssignment(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.studyStats });
    },
  });
}

export function useMarkAssignmentComplete() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, AssignmentId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.markAssignmentComplete(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.studyStats });
    },
  });
}

// ─── Scheduled Classes ────────────────────────────────────────────────────
export function useScheduledClasses() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ScheduledClass[]>({
    queryKey: QUERY_KEYS.scheduledClasses,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScheduledClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateScheduledClass() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<ScheduledClass, Error, CreateClassInput>({
    mutationFn: async ({
      subjectId,
      dayOfWeek,
      startTime,
      durationMinutes,
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createScheduledClass(
        subjectId,
        BigInt(dayOfWeek),
        startTime,
        BigInt(durationMinutes),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.scheduledClasses });
    },
  });
}

export function useDeleteScheduledClass() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteScheduledClass(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.scheduledClasses });
    },
  });
}

// ─── Pomodoro Sessions ────────────────────────────────────────────────────
export function usePomodoroSessions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PomodoroSession[]>({
    queryKey: QUERY_KEYS.pomodoroSessions,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPomodoroSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogPomodoroSession() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<PomodoroSession, Error, LogSessionInput>({
    mutationFn: async ({ subjectId, assignmentId, durationMinutes }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.logPomodoroSession(
        subjectId,
        assignmentId,
        BigInt(durationMinutes),
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.pomodoroSessions });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.studyStats });
    },
  });
}

// ─── Study Stats ──────────────────────────────────────────────────────────
export function useStudyStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StudyStats>({
    queryKey: QUERY_KEYS.studyStats,
    queryFn: async () => {
      if (!actor) {
        return {
          totalMinutesThisWeek: 0n,
          completionRatePercent: 0n,
          sessionsToday: 0n,
        };
      }
      return actor.getStudyStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// Re-export enum types so pages don't need to import from backend directly
export { AssignmentType, Priority };
