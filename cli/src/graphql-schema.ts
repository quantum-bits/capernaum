import "reflect-metadata";
import { readFileSync } from "fs";
import { plainToClass, Type as xType } from "class-transformer";

interface SchemaFile {
  __schema: Schema;
}

// Section numbering from the GraphQL spec, June 2018 edition.

// 4.5.1 The _Type Type
type __Type =
  | TypeScalar
  | TypeObject
  | TypeUnion
  | TypeInterface
  | TypeEnum
  | TypeInputObject
  | TypeList
  | TypeNonNull;

class Type implements __Type {
  kind!: TypeKind;

  name!: string;

  description!: string;

  fields!: Field[];

  interfaces!: Type[];

  possibleTypes!: Type[];

  enumValues!: EnumValue[];

  inputFields!: InputValue[];

  ofType!: Type;
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
class TypeScalar {
  kind!: TypeKind.SCALAR;

  name!: string;

  description!: string;
}

// 4.5.2.2
class TypeObject {
  kind!: TypeKind.OBJECT;

  name!: string;

  description!: string;

  fields!: Field[];

  interfaces!: Type[];
}

// 4.5.2.3
class TypeUnion {
  kind!: TypeKind.UNION;

  name!: string;

  description!: string;

  possibleTypes!: Type[];
}

// 4.5.2.4
class TypeInterface {
  kind!: TypeKind.OBJECT;

  name!: string;

  description!: string;

  fields!: Field[];

  interfaces!: Type[];

  possibleTypes!: Type[];
}

// 4.5.2.5
class TypeEnum {
  kind!: TypeKind.ENUM;

  name!: string;

  description!: string;

  enumValues!: EnumValue[];
}

// 4.5.2.6
class TypeInputObject {
  kind!: TypeKind.INPUT_OBJECT;

  name!: string;

  description!: string;

  inputFields!: InputValue[];
}

// 4.5.2.7
class TypeList {
  kind!: TypeKind.LIST;

  ofType!: Type;
}

// 4.5.2.8
class TypeNonNull {
  kind!: TypeKind.NON_NULL;

  ofType!: Type;
}

// 4.5.3 Type __Field Type
class Field {
  name!: string;

  description!: string;

  args!: InputValue[];

  type!: Type;

  isDeprecated!: boolean;

  deprecationReason!: string;
}

// 4.5.4 The __InputValue Type
class InputValue {
  name!: string;

  description!: string;

  type!: Type;

  defaultValue!: string;
}

// 4.5.5 The __EnumValue Type
class EnumValue {
  name!: string;

  description!: string;

  isDeprecated!: boolean;

  deprecationReason!: string;
}

// 4.5.6 The __Directive Type
class Directive {
  name!: string;

  description!: string;

  locations!: DirectiveLocation[];

  args!: InputValue[];
}

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

// 4.5 Schema Introspection
export class Schema {
  @xType(() => Type)
  types!: Type[];

  @xType(() => Type)
  queryType!: Type;

  @xType(() => Type)
  mutationType!: Type;

  @xType(() => Type)
  subscriptionType!: Type;

  @xType(() => Directive)
  directives!: Directive[];
}

export function loadSchema(filePath: string) {
  const json = readFileSync(filePath, "utf8");
  const plain: SchemaFile = JSON.parse(json);
  return plainToClass(Schema, plain.__schema);
}
