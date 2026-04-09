import List "mo:core/List";
import Time "mo:core/Time";
import AssignmentTypes "../types/assignments";
import AssignmentLib "../lib/assignments";

mixin (
  assignments : List.List<AssignmentTypes.Assignment>,
  nextAssignmentId : [var Nat],
) {
  public shared func createAssignment(
    subjectId : AssignmentTypes.SubjectId,
    title : Text,
    description : Text,
    deadline : AssignmentTypes.Timestamp,
    assignmentType : AssignmentTypes.AssignmentType,
    priority : AssignmentTypes.Priority,
  ) : async AssignmentTypes.Assignment {
    let a = AssignmentLib.createAssignment(
      assignments,
      nextAssignmentId[0],
      subjectId,
      title,
      description,
      deadline,
      assignmentType,
      priority,
    );
    nextAssignmentId[0] += 1;
    a;
  };

  public query func getAssignments() : async [AssignmentTypes.Assignment] {
    AssignmentLib.getAssignments(assignments);
  };

  public shared func updateAssignment(
    id : AssignmentTypes.AssignmentId,
    title : Text,
    description : Text,
    deadline : AssignmentTypes.Timestamp,
    assignmentType : AssignmentTypes.AssignmentType,
    priority : AssignmentTypes.Priority,
  ) : async Bool {
    AssignmentLib.updateAssignment(assignments, id, title, description, deadline, assignmentType, priority);
  };

  public shared func deleteAssignment(id : AssignmentTypes.AssignmentId) : async Bool {
    AssignmentLib.deleteAssignment(assignments, id);
  };

  public shared func markAssignmentComplete(id : AssignmentTypes.AssignmentId) : async Bool {
    AssignmentLib.markAssignmentComplete(assignments, id, Time.now());
  };
};
