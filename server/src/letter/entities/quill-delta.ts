// Refer to https://stackoverflow.com/questions/41510880/ for a good description of what these methods do.

import { GraphQLScalarType, Kind } from "graphql";
import Delta = require("quill-delta/dist/Delta");

const QuillDelta = new GraphQLScalarType({
  name: "QuillDelta",
  description: "Quill Delta",

  // Called when value is going to be sent to the client as a response.
  // Value can be anything (string, number, array, object, etc.)
  serialize(value: Delta) {
    const serializedValue = JSON.stringify(value);
    console.log(`Serialize '${value}' to '${serializedValue}'`);
    return serializedValue;
  },

  // Parse a value passed in a variable binding
  // For example, `query($howMany: CustomType) { users(first: $howMany) { ... } }`.
  // Variables are already JSON/JavaScript so no AST; just deal with JS directly.
  parseValue(value: string) {
    const parsedValue = JSON.parse(value);
    console.log(`Parsed value '${value}' to '${parsedValue}'`);
    return parsedValue;
  },

  // Parse a literal value in the AST that was created while parsing a query
  // For example, the parameter in `query { letter(id: 10) ... }`.
  parseLiteral(ast) {
    let parsedLiteral = null;
    if (ast.kind == Kind.STRING) {
      parsedLiteral = JSON.parse(ast.value);
    }

    console.log(`Parsed literal '${ast}' to '${parsedLiteral}'`);
    return parsedLiteral;
  }
});

export default QuillDelta;
