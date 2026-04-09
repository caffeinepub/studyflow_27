import List "mo:core/List";
import Types "../types/pomodoro";
import AssignmentTypes "../types/assignments";
import Common "../types/common";

module {
  public type PomodoroSession = Types.PomodoroSession;
  public type StudyStats = Types.StudyStats;
  public type SessionId = Common.SessionId;
  public type SubjectId = Common.SubjectId;
  public type AssignmentId = Common.AssignmentId;
  public type Timestamp = Common.Timestamp;

  let nanosecondsPerDay : Int = 86_400_000_000_000;
  let nanosecondsPerWeek : Int = 604_800_000_000_000;

  public func logPomodoroSession(
    sessions : List.List<PomodoroSession>,
    assignments : List.List<AssignmentTypes.Assignment>,
    nextId : Nat,
    subjectId : ?SubjectId,
    assignmentId : ?AssignmentId,
    durationMinutes : Nat,
    completedAt : Timestamp,
  ) : PomodoroSession {
    let session : PomodoroSession = {
      id = nextId;
      subjectId;
      assignmentId;
      durationMinutes;
      completedAt;
    };
    sessions.add(session);
    // Accumulate study time on the referenced assignment
    switch (assignmentId) {
      case (?aid) {
        assignments.mapInPlace(
          func(a) {
            if (a.id == aid) {
              { a with totalMinutesStudied = a.totalMinutesStudied + durationMinutes };
            } else {
              a;
            };
          }
        );
      };
      case null {};
    };
    session;
  };

  public func getPomodoroSessions(sessions : List.List<PomodoroSession>) : [PomodoroSession] {
    sessions.toArray();
  };

  public func getStudyStats(
    sessions : List.List<PomodoroSession>,
    assignments : List.List<AssignmentTypes.Assignment>,
    now : Timestamp,
  ) : StudyStats {
    let weekStart : Int = now - nanosecondsPerWeek;
    let dayStart : Int = now - nanosecondsPerDay;

    let totalMinutesThisWeek : Nat = sessions.foldLeft<Nat, PomodoroSession>(
      0,
      func(acc, s) {
        if (s.completedAt >= weekStart) { acc + s.durationMinutes } else { acc };
      },
    );

    let sessionsToday : Nat = sessions.foldLeft<Nat, PomodoroSession>(
      0,
      func(acc, s) {
        if (s.completedAt >= dayStart) { acc + 1 } else { acc };
      },
    );

    let totalAssignments = assignments.size();
    let completedAssignments : Nat = assignments.foldLeft<Nat, AssignmentTypes.Assignment>(
      0,
      func(acc, a) {
        if (a.isComplete) { acc + 1 } else { acc };
      },
    );

    let completionRatePercent : Nat = if (totalAssignments == 0) {
      0;
    } else {
      (completedAssignments * 100) / totalAssignments;
    };

    {
      totalMinutesThisWeek;
      completionRatePercent;
      sessionsToday;
    };
  };
};
