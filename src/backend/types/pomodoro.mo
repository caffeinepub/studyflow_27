import Common "common";

module {
  public type SessionId = Common.SessionId;
  public type SubjectId = Common.SubjectId;
  public type AssignmentId = Common.AssignmentId;
  public type Timestamp = Common.Timestamp;

  public type PomodoroSession = {
    id : SessionId;
    subjectId : ?SubjectId;
    assignmentId : ?AssignmentId;
    durationMinutes : Nat;
    completedAt : Timestamp;
  };

  public type StudyStats = {
    totalMinutesThisWeek : Nat;
    completionRatePercent : Nat;
    sessionsToday : Nat;
  };
};
