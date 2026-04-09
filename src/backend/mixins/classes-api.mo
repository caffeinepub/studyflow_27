import List "mo:core/List";
import ClassTypes "../types/classes";
import ClassLib "../lib/classes";

mixin (
  scheduledClasses : List.List<ClassTypes.ScheduledClass>,
  nextClassId : [var Nat],
) {
  public shared func createScheduledClass(
    subjectId : ClassTypes.SubjectId,
    dayOfWeek : Nat,
    startTime : Text,
    durationMinutes : Nat,
  ) : async ClassTypes.ScheduledClass {
    let sc = ClassLib.createScheduledClass(
      scheduledClasses,
      nextClassId[0],
      subjectId,
      dayOfWeek,
      startTime,
      durationMinutes,
    );
    nextClassId[0] += 1;
    sc;
  };

  public query func getScheduledClasses() : async [ClassTypes.ScheduledClass] {
    ClassLib.getScheduledClasses(scheduledClasses);
  };

  public shared func deleteScheduledClass(id : ClassTypes.ClassId) : async Bool {
    ClassLib.deleteScheduledClass(scheduledClasses, id);
  };
};
