// Refer to https://stackoverflow.com/questions/41510880/ for a good description of what these methods do.

import { GraphQLScalarType, Kind } from "graphql";
import Delta = require("quill-delta/dist/Delta");

const QuillDelta = new GraphQLScalarType({
  name: "QuillDelta",
  description: "Quill Delta",

  // Called when value is going to be sent to the client as a response.
  // Value can be anything (string, number, array, object, etc.)
  serialize(value: Delta) {
    console.log("SERIALIZE", value);
    return JSON.stringify(value);
  },

  // Parse a value passed in a variable binding
  // For example, `query($howMany: CustomType) { users(first: $howMany) { ... } }`.
  // Variables are already JSON/JavaScript so no AST; just deal with JS directly.
  parseValue(value: string) {
    console.log("VALUE", value);
    return JSON.parse(value);
  },

  // Parse a literal value in the AST that was created while parsing a query
  // For example, the parameter in `query { letter(id: 10) ... }`.
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      console.log("LITERAL", ast);
      return JSON.parse(ast.value);
    }
    return null;
  }
});

export default QuillDelta;
