import List "mo:core/List";
import Time "mo:core/Time";
import PomodoroTypes "../types/pomodoro";
import AssignmentTypes "../types/assignments";
import PomodoroLib "../lib/pomodoro";

mixin (
  pomodoroSessions : List.List<PomodoroTypes.PomodoroSession>,
  assignments : List.List<AssignmentTypes.Assignment>,
  nextSessionId : [var Nat],
) {
  public shared func logPomodoroSession(
    subjectId : ?PomodoroTypes.SubjectId,
    assignmentId : ?PomodoroTypes.AssignmentId,
    durationMinutes : Nat,
  ) : async PomodoroTypes.PomodoroSession {
    let session = PomodoroLib.logPomodoroSession(
      pomodoroSessions,
      assignments,
      nextSessionId[0],
      subjectId,
      assignmentId,
      durationMinutes,
      Time.now(),
    );
    nextSessionId[0] += 1;
    session;
  };

  public query func getPomodoroSessions() : async [PomodoroTypes.PomodoroSession] {
    PomodoroLib.getPomodoroSessions(pomodoroSessions);
  };

  public query func getStudyStats() : async PomodoroTypes.StudyStats {
    PomodoroLib.getStudyStats(pomodoroSessions, assignments, Time.now());
  };
};
