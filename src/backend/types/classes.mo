import Common "common";

module {
  public type ClassId = Common.ClassId;
  public type SubjectId = Common.SubjectId;

  public type ScheduledClass = {
    id : ClassId;
    subjectId : SubjectId;
    dayOfWeek : Nat; // 0 = Sunday, 6 = Saturday
    startTime : Text; // "HH:MM" format
    durationMinutes : Nat;
  };
};
