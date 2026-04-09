import Common "common";

module {
  public type SubjectId = Common.SubjectId;

  public type Subject = {
    id : SubjectId;
    name : Text;
    color : Text; // hex string e.g. "#FF5733"
  };
};
