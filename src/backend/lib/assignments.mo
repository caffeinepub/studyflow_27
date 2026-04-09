import List "mo:core/List";
import Types "../types/assignments";
import Common "../types/common";

module {
  public type Assignment = Types.Assignment;
  public type AssignmentId = Common.AssignmentId;
  public type SubjectId = Common.SubjectId;
  public type Timestamp = Common.Timestamp;
  public type AssignmentType = Types.AssignmentType;
  public type Priority = Types.Priority;

  public func createAssignment(
    assignments : List.List<Assignment>,
    nextId : Nat,
    subjectId : SubjectId,
    title : Text,
    description : Text,
    deadline : Timestamp,
    assignmentType : AssignmentType,
    priority : Priority,
  ) : Assignment {
    let a : Assignment = {
      id = nextId;
      subjectId;
      title;
      description;
      deadline;
      assignmentType;
      priority;
      isComplete = false;
      completedAt = null;
      totalMinutesStudied = 0;
    };
    assignments.add(a);
    a;
  };

  public func getAssignments(assignments : List.List<Assignment>) : [Assignment] {
    assignments.toArray();
  };

  public func updateAssignment(
    assignments : List.List<Assignment>,
    id : AssignmentId,
    title : Text,
    description : Text,
    deadline : Timestamp,
    assignmentType : AssignmentType,
    priority : Priority,
  ) : Bool {
    var found = false;
    assignments.mapInPlace(
      func(a) {
        if (a.id == id) {
          found := true;
          { a with title; description; deadline; assignmentType; priority };
        } else {
          a;
        };
      }
    );
    found;
  };

  public func deleteAssignment(assignments : List.List<Assignment>, id : AssignmentId) : Bool {
    let sizeBefore = assignments.size();
    let filtered = assignments.filter(func(a) { a.id != id });
    assignments.clear();
    assignments.append(filtered);
    assignments.size() < sizeBefore;
  };

  public func markAssignmentComplete(
    assignments : List.List<Assignment>,
    id : AssignmentId,
    completedAt : Timestamp,
  ) : Bool {
    var found = false;
    assignments.mapInPlace(
      func(a) {
        if (a.id == id) {
          found := true;
          { a with isComplete = true; completedAt = ?completedAt };
        } else {
          a;
        };
      }
    );
    found;
  };
};
