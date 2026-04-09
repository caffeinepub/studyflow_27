import List "mo:core/List";
import Types "../types/subjects";
import Common "../types/common";

module {
  public type Subject = Types.Subject;
  public type SubjectId = Common.SubjectId;

  public func createSubject(
    subjects : List.List<Subject>,
    nextId : Nat,
    name : Text,
    color : Text,
  ) : Subject {
    let subject : Subject = { id = nextId; name; color };
    subjects.add(subject);
    subject;
  };

  public func getSubjects(subjects : List.List<Subject>) : [Subject] {
    subjects.toArray();
  };

  public func updateSubject(
    subjects : List.List<Subject>,
    id : SubjectId,
    name : Text,
    color : Text,
  ) : Bool {
    var found = false;
    subjects.mapInPlace(
      func(s) {
        if (s.id == id) {
          found := true;
          { s with name; color };
        } else {
          s;
        };
      }
    );
    found;
  };

  public func deleteSubject(subjects : List.List<Subject>, id : SubjectId) : Bool {
    let sizeBefore = subjects.size();
    let filtered = subjects.filter(func(s) { s.id != id });
    subjects.clear();
    subjects.append(filtered);
    subjects.size() < sizeBefore;
  };
};
