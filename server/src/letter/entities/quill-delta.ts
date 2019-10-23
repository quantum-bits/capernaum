import { GraphQLScalarType, Kind } from "graphql";
import Delta = require("quill-delta/dist/Delta");

const QuillDelta = new GraphQLScalarType({
  name: "QuillDelta",
  description: "Quill Delta",
  parseValue(value: string) {
    console.log("VALUE", value);
    return JSON.parse(value);
  },
  serialize(value: Delta) {
    console.log("SERIALIZE", value);
    return JSON.stringify(value);
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      console.log("LITERAL", ast);
      return JSON.parse(ast.value);
    }
    return null;
  }
});

export default QuillDelta;
