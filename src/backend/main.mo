import List "mo:core/List";
import SubjectTypes "types/subjects";
import AssignmentTypes "types/assignments";
import ClassTypes "types/classes";
import PomodoroTypes "types/pomodoro";
import SubjectsApi "mixins/subjects-api";
import AssignmentsApi "mixins/assignments-api";
import ClassesApi "mixins/classes-api";
import PomodoroApi "mixins/pomodoro-api";

actor {
  let subjects = List.empty<SubjectTypes.Subject>();
  let nextSubjectId = [var 1 : Nat];

  let assignments = List.empty<AssignmentTypes.Assignment>();
  let nextAssignmentId = [var 1 : Nat];

  let scheduledClasses = List.empty<ClassTypes.ScheduledClass>();
  let nextClassId = [var 1 : Nat];

  let pomodoroSessions = List.empty<PomodoroTypes.PomodoroSession>();
  let nextSessionId = [var 1 : Nat];

  include SubjectsApi(subjects, nextSubjectId);
  include AssignmentsApi(assignments, nextAssignmentId);
  include ClassesApi(scheduledClasses, nextClassId);
  include PomodoroApi(pomodoroSessions, assignments, nextSessionId);
};
