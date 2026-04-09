import type { backendInterface } from "../backend";
import { AssignmentType, Priority } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const oneDay = BigInt(24 * 60 * 60 * 1_000_000_000);

const subjects = [
  { id: BigInt(1), name: "Mathematics", color: "chart-1" },
  { id: BigInt(2), name: "Physics", color: "chart-2" },
  { id: BigInt(3), name: "Computer Science", color: "chart-3" },
  { id: BigInt(4), name: "Literature", color: "chart-4" },
  { id: BigInt(5), name: "History", color: "chart-5" },
];

const assignments = [
  {
    id: BigInt(1),
    title: "Calculus Problem Set 4",
    description: "Solve integration problems from chapters 8-10",
    deadline: now + oneDay * BigInt(2),
    subjectId: BigInt(1),
    assignmentType: AssignmentType.assignment,
    priority: Priority.high,
    totalMinutesStudied: BigInt(45),
    isComplete: false,
  },
  {
    id: BigInt(2),
    title: "Physics Midterm Exam",
    description: "Covers mechanics, waves, and thermodynamics",
    deadline: now + oneDay * BigInt(5),
    subjectId: BigInt(2),
    assignmentType: AssignmentType.exam,
    priority: Priority.high,
    totalMinutesStudied: BigInt(120),
    isComplete: false,
  },
  {
    id: BigInt(3),
    title: "Algorithm Analysis Report",
    description: "Big-O analysis of sorting algorithms",
    deadline: now + oneDay * BigInt(7),
    subjectId: BigInt(3),
    assignmentType: AssignmentType.assignment,
    priority: Priority.medium,
    totalMinutesStudied: BigInt(60),
    isComplete: false,
  },
  {
    id: BigInt(4),
    title: "Essay: Romantic Poetry",
    description: "Compare Keats and Shelley themes",
    deadline: now + oneDay * BigInt(3),
    subjectId: BigInt(4),
    assignmentType: AssignmentType.assignment,
    priority: Priority.medium,
    totalMinutesStudied: BigInt(30),
    isComplete: true,
    completedAt: now - oneDay,
  },
  {
    id: BigInt(5),
    title: "History Research Paper",
    description: "Industrial Revolution effects on society",
    deadline: now + oneDay * BigInt(10),
    subjectId: BigInt(5),
    assignmentType: AssignmentType.assignment,
    priority: Priority.low,
    totalMinutesStudied: BigInt(20),
    isComplete: false,
  },
];

const scheduledClasses = [
  { id: BigInt(1), subjectId: BigInt(1), dayOfWeek: BigInt(1), startTime: "09:00", durationMinutes: BigInt(60) },
  { id: BigInt(2), subjectId: BigInt(2), dayOfWeek: BigInt(1), startTime: "11:00", durationMinutes: BigInt(90) },
  { id: BigInt(3), subjectId: BigInt(3), dayOfWeek: BigInt(2), startTime: "10:00", durationMinutes: BigInt(60) },
  { id: BigInt(4), subjectId: BigInt(4), dayOfWeek: BigInt(3), startTime: "14:00", durationMinutes: BigInt(60) },
  { id: BigInt(5), subjectId: BigInt(5), dayOfWeek: BigInt(4), startTime: "13:00", durationMinutes: BigInt(90) },
  { id: BigInt(6), subjectId: BigInt(1), dayOfWeek: BigInt(4), startTime: "09:00", durationMinutes: BigInt(60) },
  { id: BigInt(7), subjectId: BigInt(2), dayOfWeek: BigInt(5), startTime: "11:00", durationMinutes: BigInt(90) },
];

const pomodoroSessions = [
  { id: BigInt(1), completedAt: now - oneDay * BigInt(0) - BigInt(3600_000_000_000), durationMinutes: BigInt(25), subjectId: BigInt(1) },
  { id: BigInt(2), completedAt: now - oneDay * BigInt(0) - BigInt(7200_000_000_000), durationMinutes: BigInt(25), subjectId: BigInt(3) },
  { id: BigInt(3), completedAt: now - oneDay * BigInt(1), durationMinutes: BigInt(25), subjectId: BigInt(2) },
  { id: BigInt(4), completedAt: now - oneDay * BigInt(1) - BigInt(3600_000_000_000), durationMinutes: BigInt(50), subjectId: BigInt(1) },
  { id: BigInt(5), completedAt: now - oneDay * BigInt(2), durationMinutes: BigInt(25), subjectId: BigInt(4) },
];

export const mockBackend: backendInterface = {
  createSubject: async (name, color) => ({ id: BigInt(6), name, color }),
  updateSubject: async () => true,
  deleteSubject: async () => true,
  getSubjects: async () => subjects,

  createAssignment: async (subjectId, title, description, deadline, assignmentType, priority) => ({
    id: BigInt(6),
    subjectId,
    title,
    description,
    deadline,
    assignmentType,
    priority,
    totalMinutesStudied: BigInt(0),
    isComplete: false,
  }),
  updateAssignment: async () => true,
  deleteAssignment: async () => true,
  markAssignmentComplete: async () => true,
  getAssignments: async () => assignments,

  createScheduledClass: async (subjectId, dayOfWeek, startTime, durationMinutes) => ({
    id: BigInt(8),
    subjectId,
    dayOfWeek,
    startTime,
    durationMinutes,
  }),
  deleteScheduledClass: async () => true,
  getScheduledClasses: async () => scheduledClasses,

  logPomodoroSession: async (subjectId, assignmentId, durationMinutes) => ({
    id: BigInt(6),
    completedAt: BigInt(Date.now()) * BigInt(1_000_000),
    durationMinutes,
    ...(subjectId !== null ? { subjectId } : {}),
    ...(assignmentId !== null ? { assignmentId } : {}),
  }),
  getPomodoroSessions: async () => pomodoroSessions,

  getStudyStats: async () => ({
    totalMinutesThisWeek: BigInt(300),
    completionRatePercent: BigInt(72),
    sessionsToday: BigInt(2),
  }),
};
