import Common "common";

module {
  public type AssignmentId = Common.AssignmentId;
  public type SubjectId = Common.SubjectId;
  public type Timestamp = Common.Timestamp;

  public type AssignmentType = { #assignment; #exam };
  public type Priority = { #low; #medium; #high };

  public type Assignment = {
    id : AssignmentId;
    subjectId : SubjectId;
    title : Text;
    description : Text;
    deadline : Timestamp;
    assignmentType : AssignmentType;
    priority : Priority;
    isComplete : Bool;
    completedAt : ?Timestamp;
    totalMinutesStudied : Nat;
  };
};
