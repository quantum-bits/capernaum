/* eslint-disable @typescript-eslint/no-use-before-define,no-console */
import { readFileSync } from "fs";
import { inspect } from "util";
import { ensureValue } from "./helpers";
import chalk from "chalk";

interface SchemaFile {
  __schema: Schema;
}

// Section numbering from the GraphQL spec, June 2018 edition.

// 4.5.1 The __Type Type

interface KitchenSinkType {
  kind: TypeKind;
  name: string;
  description: string;
  fields: Field[];
  interfaces: Type[];
  possibleTypes: Type[];
  enumValues: EnumValue[];
  inputFields: InputValue[];
  ofType: Type;
}

type Type =
  | TypeScalar
  | TypeObject
  | TypeUnion
  | TypeInterface
  | TypeEnum
  | TypeInputObject
  | TypeList
  | TypeNonNull;

abstract class BaseType {
  name: string;

  description: string;

  constructor(json: BaseType) {
    this.name = json.name;
    this.description = json.description;
  }

  toString() {
    const segments = [chalk.bold(this.name)];
    if (this.description) {
      segments.push(chalk.italic.underline.yellow(this.description));
    }
    return segments.join(" ");
  }
}

// 4.5.2 Type Kinds
enum TypeKind {
  SCALAR = "SCALAR",
  OBJECT = "OBJECT",
  INTERFACE = "INTERFACE",
  UNION = "UNION",
  ENUM = "ENUM",
  INPUT_OBJECT = "INPUT_OBJECT",
  LIST = "LIST",
  NON_NULL = "NON_NULL",
}

// 4.5.2.1
class TypeScalar extends BaseType {}

// 4.5.2.2
export class TypeObject extends BaseType {
  fields: Field[] = [];

  interfaces: Type[] = [];

  constructor(json: TypeObject) {
    super(json);
    if (json.fields) {
      this.fields = json.fields.map((f) => new Field(f));
    }
    if (json.interfaces) {
      this.interfaces = json.interfaces.map((i) => typeFactory(i));
    }
  }
}

// 4.5.2.3
class TypeUnion extends BaseType {
  possibleTypes: Type[];

  constructor(json: TypeUnion) {
    super(json);
    this.possibleTypes = json.possibleTypes.map((pt) => typeFactory(pt));
  }
}

// 4.5.2.4
class TypeInterface extends BaseType {
  fields: Field[];

  interfaces: Type[];

  possibleTypes: Type[];

  constructor(json: TypeInterface) {
    super(json);
    this.fields = json.fields.map((f) => new Field(f));
    this.interfaces = json.interfaces.map((i) => typeFactory(i));
    this.possibleTypes = json.possibleTypes.map((pt) => typeFactory(pt));
  }
}

// 4.5.2.5
class TypeEnum extends BaseType {
  enumValues: EnumValue[] = [];

  constructor(json: TypeEnum) {
    super(json);
    if (json.enumValues) {
      this.enumValues = json.enumValues.map((ev) => new EnumValue(ev));
    }
  }
}

// 4.5.2.6
class TypeInputObject extends BaseType {
  inputFields: InputValue[] = [];

  constructor(json: TypeInputObject) {
    super(json);
    if (json.inputFields) {
      this.inputFields = json.inputFields.map((i) => new InputValue(i));
    }
  }
}

// 4.5.2.7
class TypeList extends BaseType {
  ofType: Type;

  constructor(json: TypeList) {
    super(json);
    this.ofType = typeFactory(json.ofType);
  }

  toString() {
    return `[${this.ofType}]`;
  }
}

// 4.5.2.8
class TypeNonNull extends BaseType {
  ofType: Type;

  constructor(json: TypeNonNull) {
    super(json);
    this.ofType = typeFactory(json.ofType);
  }

  toString() {
    return `${this.ofType}!`;
  }
}

// 4.5.3 Type __Field Type
export class Field extends BaseType {
  args: InputValue[];

  type: Type;

  isDeprecated: boolean;

  deprecationReason: string;

  constructor(json: Field) {
    super(json);
    this.name = json.name;
    this.description = json.description;
    this.args = json.args.map((a) => new InputValue(a));
    this.type = typeFactory(json.type);
    this.isDeprecated = json.isDeprecated;
    this.deprecationReason = json.deprecationReason;
  }

  toString() {
    const segments = [super.toString()];
    if (this.args.length > 0) {
      segments.push(
        chalk.blue(
          "(" + this.args.map((arg) => arg.toString()).join(", ") + ")"
        )
      );
    }
    segments.push(chalk.green(this.type.toString()));
    return segments.join(" ");
  }
}

// 4.5.4 The __InputValue Type
class InputValue extends BaseType {
  type: Type;

  defaultValue: string;

  constructor(json: InputValue) {
    super(json);
    this.name = json.name;
    this.description = json.description;
    this.type = typeFactory(json.type);
    this.defaultValue = json.defaultValue;
  }

  toString() {
    return `${super.toString()}: ${this.type}`;
  }
}

// 4.5.5 The __EnumValue Type
class EnumValue extends BaseType {
  isDeprecated: boolean;

  deprecationReason: string;

  constructor(json: EnumValue) {
    super(json);
    this.name = json.name;
    this.description = json.description;
    this.isDeprecated = json.isDeprecated;
    this.deprecationReason = json.deprecationReason;
  }
}

// 4.5.6 The __Directive Type
class Directive extends BaseType {
  locations: DirectiveLocation[];

  args: InputValue[];

  constructor(json: Directive) {
    super(json);
    this.name = json.name;
    this.description = json.description;
    this.locations = json.locations;
    this.args = json.args.map((a) => new InputValue(a));
  }
}

// noinspection JSUnusedGlobalSymbols
enum DirectiveLocation {
  QUERY = "QUERY",
  MUTATION = "MUTATION",
  SUBSCRIPTION = "SUBSCRIPTION",
  FIELD = "FIELD",
  FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION",
  FRAGMENT_SPREAD = "FRAGMENT_SPREAD",
  INLINE_FRAGMENT = "INLINE_FRAGMENT",
  SCHEMA = "SCHEMA",
  SCALAR = "SCALAR",
  OBJECT = "OBJECT",
  FIELD_DEFINITION = "FIELD_DEFINITION",
  ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION",
  INTERFACE = "INTERFACE",
  UNION = "UNION",
  ENUM = "ENUM",
  ENUM_VALUE = "ENUM_VALUE",
  INPUT_OBJECT = "INPUT_OBJECT",
  INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION",
}

function typeFactory(json: any) {
  if (!json) {
    throw new Error(`Type factory json is '${json}'`);
  }
  switch (json.kind) {
    case TypeKind.SCALAR:
      return new TypeScalar(json);
    case TypeKind.OBJECT:
      return new TypeObject(json);
    case TypeKind.INTERFACE:
      return new TypeInterface(json);
    case TypeKind.UNION:
      return new TypeUnion(json);
    case TypeKind.ENUM:
      return new TypeEnum(json);
    case TypeKind.INPUT_OBJECT:
      return new TypeInputObject(json);
    case TypeKind.LIST:
      return new TypeList(json);
    case TypeKind.NON_NULL:
      return new TypeNonNull(json);
    default:
      throw new Error(`Don't know type kind ${json.kind}`);
  }
}

// 4.5 Schema Introspection
export class Schema {
  types: Type[];

  queryType: Type;

  mutationType: Type;

  subscriptionType: Type;

  directives: Directive[];

  constructor(filePath: string) {
    const jsonFile: SchemaFile = JSON.parse(readFileSync(filePath, "utf8"));
    const json = jsonFile.__schema;

    this.types = json.types.map((t) => typeFactory(t));
    this.directives = json.directives.map((d) => new Directive(d));

    this.queryType = ensureValue(
      this.types.find((t) => t.name === json.queryType.name),
      "No type-level query type"
    );
    this.mutationType = ensureValue(
      this.types.find((t) => t.name === json.mutationType.name),
      "No top-level mutation type"
    );
    this.subscriptionType = ensureValue(
      this.types.find((t) => t.name === json.subscriptionType.name),
      "No top-level subscription type"
    );
  }

  toString() {
    return inspect(this, { depth: Infinity });
  }
}
