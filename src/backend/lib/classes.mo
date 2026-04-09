import List "mo:core/List";
import Types "../types/classes";
import Common "../types/common";

module {
  public type ScheduledClass = Types.ScheduledClass;
  public type ClassId = Common.ClassId;
  public type SubjectId = Common.SubjectId;

  public func createScheduledClass(
    classes : List.List<ScheduledClass>,
    nextId : Nat,
    subjectId : SubjectId,
    dayOfWeek : Nat,
    startTime : Text,
    durationMinutes : Nat,
  ) : ScheduledClass {
    let sc : ScheduledClass = {
      id = nextId;
      subjectId;
      dayOfWeek;
      startTime;
      durationMinutes;
    };
    classes.add(sc);
    sc;
  };

  public func getScheduledClasses(classes : List.List<ScheduledClass>) : [ScheduledClass] {
    classes.toArray();
  };

  public func deleteScheduledClass(classes : List.List<ScheduledClass>, id : ClassId) : Bool {
    let sizeBefore = classes.size();
    let filtered = classes.filter(func(c) { c.id != id });
    classes.clear();
    classes.append(filtered);
    classes.size() < sizeBefore;
  };
};
