import Command from "@oclif/command";
import inquirer from "inquirer";
import * as _ from "lodash";
import { inspect } from "util";
import { ConcreteTypeInfo, Field, Schema, TypeObject } from "../graphql-schema";
import { gql } from "@apollo/client/core";
import { graphqlClient } from "../graphql-client";
import debugFactory from "debug";
import { TypeKind } from "graphql";

const debug = debugFactory("query");

export default class Query extends Command {
  private schema = new Schema("generated-schema.json");

  static description = "run a GraphQL query";

  async run() {
    const answers = await inquirer.prompt<{ selection: Field }>([
      {
        type: "list",
        name: "selection",
        message: "Choose a query to execute",
        choices: this.schema.getQueries().map((q) => ({
          name: q.toString(),
          value: q,
        })),
        pageSize: 30,
      },
    ]);
    const queryField = answers.selection;

    this.log(inspect(queryField, { depth: Infinity }));
    this.log("-".repeat(30));
    this.log(queryField.toString());

    const queryResultType = queryField.concreteType();
    debug("queryResultType %O", queryResultType);

    const concreteArgs = queryField.concreteArgs();
    if (concreteArgs.length > 0) {
      const questions = concreteArgs.map((arg) => ({
        type: "input",
        name: arg.name,
        message: `Value for '${arg.name}'`,
      }));

      const answers = await inquirer.prompt(questions);

      concreteArgs.forEach((arg) => {
        arg.value = answers[arg.name];
      });
    }
    debug("concreteArgs %O", concreteArgs);

    const queryResultDetails = this.schema.getType(queryResultType.name);
    debug("queryResultDetails %O", queryResultDetails);

    if (!(queryResultDetails instanceof TypeObject)) {
      throw new TypeError(
        `Don't handle result with kind ${queryResultDetails.kind}`
      );
    }

    const concreteTypes = queryResultDetails.concreteTypes();
    debug("concreteTypes %O", concreteTypes);

    const fields = concreteTypes
      .filter((ct) => ct.kind === TypeKind.SCALAR)
      .map((ct) => ct.name)
      .join(" ");

    function formatArgs(args: ConcreteTypeInfo[]) {
      if (args.length > 0) {
        const formattedArgs = args
          .map((ca) => `${ca.name}: ${ca.value}`)
          .join(", ");
        return `(${formattedArgs})`;
      }
      return "";
    }

    const queryString = [
      "query {",
      queryField.name,
      formatArgs(concreteArgs),
      `{ ${fields} } }`,
    ].join(" ");
    debug("queryString %O", queryString);

    graphqlClient()
      .query({
        query: gql(queryString),
      })
      .then((response) => this.log(inspect(response, { depth: Infinity })));
  }
}
