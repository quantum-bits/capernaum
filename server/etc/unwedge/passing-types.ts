class Group {
  id: number;
  name: string;
  adminEmail: string;
  toString() {
    return `<Group ${this.id}: ${this.name} (${this.adminEmail})>`;
  }
}

class GroupType {
  id: number;
  name: string;
  code: string;
  seq: number;
  groups: Group[];
  toString() {
    return `<GroupType ${this.id} ${this.name} ${this.groups.toString()}>`;
  }
}

function foo(groupType: GroupType) {
  console.log("Group type", groupType.toString());
  return [groupType];
}

const g1 = new Group();
g1.id = 17;
g1.name = "Groupie";
g1.adminEmail = "groupie@example.com";

const gt1 = new GroupType();
gt1.id = 42;
gt1.name = "Answer";
gt1.code = "fobolazu";
gt1.seq = 1;
gt1.groups = [g1];

const rtn = foo(gt1);
console.log("RTN", rtn);

function bar(arg) {
  console.log("ARG", arg);
  return [arg];
}

const rtn2 = bar(GroupType);
console.log("RTN2", rtn2);

function DecoratorFactory<T>(
  description: string,
  typeFunction: any,
  inverseFunction: any
): PropertyDecorator {
  return (target: any, propertyName: string) => {
    console.log("DEC FAC", description);
    console.log("DEC TYP", typeFunction.toString());
    console.log("DEC INV", inverseFunction.toString());
  };
}

class Baz {
  @DecoratorFactory("test description", Group, GroupType)
  public zipZap: string;
}
