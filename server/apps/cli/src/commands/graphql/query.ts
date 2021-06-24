import inquirer from "inquirer";
import { ConcreteTypeInfo, Field, Schema, TypeObject } from "./graphql-schema";
import { gql } from "@apollo/client/core";
import { graphqlClient } from "./graphql-client";
import { TypeKind } from "graphql";
import prettyFormat from "pretty-format";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("cli");

export default class Query {
  //extends Command {
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
    // Field element from within Query.
    const queryField = answers.selection;
    debug("queryField %O", queryField);

    // Type of result returned by the query.
    const queryResultType = queryField.concreteType();
    debug("queryResultType %O", queryResultType);

    // If the query takes arguments, create an inquirer prompt
    // to ask for the values from the user.
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

    // Retrieve the top of the query's results.
    const queryResultDetails = this.schema.getType(queryResultType.name);
    debug("queryResultDetails %O", queryResultDetails);

    if (!(queryResultDetails instanceof TypeObject)) {
      throw new TypeError(
        `Don't handle result with kind ${queryResultDetails.kind}`
      );
    }

    // Grab the concrete types for each of the result fields.
    const concreteTypes = queryResultDetails.concreteTypes();
    debug("concreteTypes %O", concreteTypes);

    // Construct the list of names of result values.
    const fields = concreteTypes
      .filter((ct) => ct.kind === TypeKind.SCALAR)
      .map((ct) => ct.name)
      .join(" ");

    // Format the arguments to pass to the query.
    function formatArgs(args: ConcreteTypeInfo[]) {
      if (args.length > 0) {
        const formattedArgs = args
          .map((ca) => `${ca.name}: ${ca.value}`)
          .join(", ");
        return `(${formattedArgs})`;
      }
      return "";
    }

    // Build the GraphQL query string.
    const queryString = [
      "query {",
      queryField.name,
      formatArgs(concreteArgs),
      `{ ${fields} } }`,
    ].join(" ");
    debug("queryString %O", queryString);

    // Hit the GraphQL server and show the results.
    graphqlClient()
      .query({
        query: gql(queryString),
      })
      .then((response) => console.log(prettyFormat(response)));
  }
}
