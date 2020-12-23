import Command from "@oclif/command";
import inquirer from "inquirer";
import * as _ from "lodash";
import { inspect } from "util";
import { loadSchema } from "../graphql-schema";

export default class Query extends Command {
  private schema = loadSchema("generated-schema.json");

  static description = "run a GraphQL query";

  async run() {
    const queryType = _.find(
      this.schema.types,
      (t) => t.name === this.schema.queryType.name
    );
    if (!queryType) {
      throw new Error("Can't find top-level query type");
    }
    const sortedQueries = _.sortBy(queryType.fields, (f) => f.name);

    inquirer
      .prompt([
        {
          type: "list",
          name: "query",
          message: "Choose a query to execute",
          choices: _.map(sortedQueries, (q) => ({
            name: q.name,
            value: q,
          })),
          pageSize: _.min([sortedQueries.length, 30]),
        },
      ])
      .then((answers) => {
        this.log(inspect(answers.query, { depth: Infinity }));
      });
  }
}
