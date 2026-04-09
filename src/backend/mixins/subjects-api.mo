import List "mo:core/List";
import SubjectTypes "../types/subjects";
import SubjectLib "../lib/subjects";

mixin (
  subjects : List.List<SubjectTypes.Subject>,
  nextSubjectId : [var Nat],
) {
  public shared func createSubject(name : Text, color : Text) : async SubjectTypes.Subject {
    let subject = SubjectLib.createSubject(subjects, nextSubjectId[0], name, color);
    nextSubjectId[0] += 1;
    subject;
  };

  public query func getSubjects() : async [SubjectTypes.Subject] {
    SubjectLib.getSubjects(subjects);
  };

  public shared func updateSubject(id : SubjectTypes.SubjectId, name : Text, color : Text) : async Bool {
    SubjectLib.updateSubject(subjects, id, name, color);
  };

  public shared func deleteSubject(id : SubjectTypes.SubjectId) : async Bool {
    SubjectLib.deleteSubject(subjects, id);
  };
};
