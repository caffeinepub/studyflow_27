import type {
  Assignment,
  AssignmentId,
  AssignmentType,
  ClassId,
  PomodoroSession,
  Priority,
  ScheduledClass,
  SessionId,
  StudyStats,
  Subject,
  SubjectId,
  Timestamp,
} from "../backend";

export type {
  Assignment,
  AssignmentId,
  AssignmentType,
  ClassId,
  PomodoroSession,
  Priority,
  ScheduledClass,
  SessionId,
  StudyStats,
  Subject,
  SubjectId,
  Timestamp,
};

export const SUBJECT_COLORS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

export type SubjectColorKey = (typeof SUBJECT_COLORS)[number];

/** Numeric index 1–5 derived from the color string stored on Subject */
export function getSubjectColorIndex(subject: Subject): 1 | 2 | 3 | 4 | 5 {
  const map: Record<string, 1 | 2 | 3 | 4 | 5> = {
    "chart-1": 1,
    "chart-2": 2,
    "chart-3": 3,
    "chart-4": 4,
    "chart-5": 5,
    blue: 1,
    green: 2,
    amber: 3,
    purple: 4,
    red: 5,
  };
  return map[subject.color] ?? 1;
}

export interface CreateSubjectInput {
  name: string;
  color: string;
}

export interface CreateAssignmentInput {
  subjectId: SubjectId;
  title: string;
  description: string;
  deadline: Date;
  assignmentType: AssignmentType;
  priority: Priority;
}

export interface CreateClassInput {
  subjectId: SubjectId;
  dayOfWeek: number;
  startTime: string;
  durationMinutes: number;
}

export interface LogSessionInput {
  subjectId: SubjectId | null;
  assignmentId: AssignmentId | null;
  durationMinutes: number;
}
