import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface StudyStats {
    completionRatePercent: bigint;
    totalMinutesThisWeek: bigint;
    sessionsToday: bigint;
}
export interface PomodoroSession {
    id: SessionId;
    completedAt: Timestamp;
    durationMinutes: bigint;
    assignmentId?: AssignmentId;
    subjectId?: SubjectId;
}
export type AssignmentId = bigint;
export interface Assignment {
    id: AssignmentId;
    completedAt?: Timestamp;
    title: string;
    assignmentType: AssignmentType;
    description: string;
    deadline: Timestamp;
    subjectId: SubjectId;
    priority: Priority;
    totalMinutesStudied: bigint;
    isComplete: boolean;
}
export type SessionId = bigint;
export type ClassId = bigint;
export type SubjectId = bigint;
export interface Subject {
    id: SubjectId;
    name: string;
    color: string;
}
export interface ScheduledClass {
    id: ClassId;
    startTime: string;
    dayOfWeek: bigint;
    durationMinutes: bigint;
    subjectId: SubjectId;
}
export enum AssignmentType {
    assignment = "assignment",
    exam = "exam"
}
export enum Priority {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    createAssignment(subjectId: SubjectId, title: string, description: string, deadline: Timestamp, assignmentType: AssignmentType, priority: Priority): Promise<Assignment>;
    createScheduledClass(subjectId: SubjectId, dayOfWeek: bigint, startTime: string, durationMinutes: bigint): Promise<ScheduledClass>;
    createSubject(name: string, color: string): Promise<Subject>;
    deleteAssignment(id: AssignmentId): Promise<boolean>;
    deleteScheduledClass(id: ClassId): Promise<boolean>;
    deleteSubject(id: SubjectId): Promise<boolean>;
    getAssignments(): Promise<Array<Assignment>>;
    getPomodoroSessions(): Promise<Array<PomodoroSession>>;
    getScheduledClasses(): Promise<Array<ScheduledClass>>;
    getStudyStats(): Promise<StudyStats>;
    getSubjects(): Promise<Array<Subject>>;
    logPomodoroSession(subjectId: SubjectId | null, assignmentId: AssignmentId | null, durationMinutes: bigint): Promise<PomodoroSession>;
    markAssignmentComplete(id: AssignmentId): Promise<boolean>;
    updateAssignment(id: AssignmentId, title: string, description: string, deadline: Timestamp, assignmentType: AssignmentType, priority: Priority): Promise<boolean>;
    updateSubject(id: SubjectId, name: string, color: string): Promise<boolean>;
}
