import { GraphQLScalarType, Kind } from "graphql";
import Delta = require("quill-delta/dist/Delta");

const QuillDelta = new GraphQLScalarType({
  name: "QuillDelta",
  description: "Quill Delta",
  parseValue(value: string) {
    return JSON.parse(value);
  },
  serialize(value: Delta) {
    return JSON.stringify(value);
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      return 1;
    }
    return null;
  }
});

export default QuillDelta;
