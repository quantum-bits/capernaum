import "reflect-metadata";

function ClassDecorator(...args: any[]) {
  console.log("CLASS");
  args.forEach((arg, idx) => console.log(`  ${idx} - ${arg}`));
}

function MethodDecorator(...args: any[]) {
  console.log("METHOD");
  args.forEach((arg, idx) => console.log(`  ${idx} - ${arg}`));
}

function PropertyDecorator(...args: any[]) {
  console.log("PROPERTY");
  args.forEach((arg, idx) => console.log(`  ${idx} - ${arg}`));
}

function ParameterDecorator(...args: any[]) {
  console.log("PARAMETER");
  args.forEach((arg, idx) => console.log(`  ${idx} - ${arg}`));
}

function AccessorDecorator(...args: any[]) {
  console.log("ACCESSOR");
  args.forEach((arg, idx) => console.log(`  ${idx} - ${arg}`));
}

function GenericDecorator(type: string) {
  return function (...args: any[]) {
    console.log("\n", type.toLocaleUpperCase());
    args.forEach((arg, idx) => {
      if (typeof arg === "object") {
        console.log(`  ${idx} - ${JSON.stringify(arg)}`);
      } else {
        console.log(`  ${idx} - ${arg}`);
      }
    });
  };
}

@GenericDecorator("Class")
class Writing {
  @GenericDecorator("Property")
  private author: string;
  private content: string;

  constructor(
    @GenericDecorator("Ctor Parameter") author: string,
    content: string
  ) {
    this.author = author;
    this.content = content;
  }

  @GenericDecorator("Accessor")
  get theAuthor() {
    return this.author;
  }

  doubleUp(
    @GenericDecorator("Parameter 1") v1: number,
    @GenericDecorator("Parameter 2") v2: number
  ) {
    return (v1 + v2) * 2;
  }

  @GenericDecorator("Class Method")
  static something() {
    console.log("This is something");
  }

  @GenericDecorator("Instance Method")
  everything() {
    console.log(this.author, this.content);
  }
}
