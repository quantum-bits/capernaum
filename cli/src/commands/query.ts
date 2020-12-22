import { Command } from "@oclif/command";
const schemaFile = require("../../generated-schema.json");
const schema = schemaFile.__schema;
import * as _ from "lodash";

interface Field {
  name: string;
  description: string;
}

export default class Query extends Command {
  static description = "run a GraphQL Query";

  async run() {
    const allQueries: Field[] = _.find(
      schema.types,
      (t) => t.name === schema.queryType.name
    ).fields;

    _(allQueries)
      .sortBy((q) => q.name)
      .forEach((q) => this.log(q.name, q.description || ""));
  }
}
