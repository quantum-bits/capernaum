import Command from "@oclif/command";
import inquirer from "inquirer";
import * as _ from "lodash";
import { inspect } from "util";
import { Field, Schema, TypeObject } from "../graphql-schema";
import { ensureType } from "../helpers";
import fetch from "cross-fetch";
import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
} from "@apollo/client/core";

export default class Query extends Command {
  private schema = new Schema("generated-schema.json");

  static description = "run a GraphQL query";

  async run() {
    const sortedQueries = _.sortBy(
      ensureType(this.schema.queryType, TypeObject).fields,
      (f) => f.name
    );

    const client = new ApolloClient({
      link: new HttpLink({ uri: "http://localhost:3000/graphql", fetch }),
      cache: new InMemoryCache(),
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "query",
          message: "Choose a query to execute",
          choices: _.map(sortedQueries, (q) => ({
            name: q.toString(),
            value: q,
          })),
          pageSize: 30,
        },
      ])
      .then((answers) => answers.query)
      .then((field: Field) => {
        this.log(inspect(field, { depth: Infinity }));
        this.log("-".repeat(30));
        this.log(field.toString());

        const queryString = `
          query {
            ${field.name} {
              id
            }
          }
        `;
        this.log("QUERY", queryString);

        client
          .query({
            query: gql(queryString),
          })
          .then((response) => this.log(inspect(response, { depth: Infinity })));
      });
  }
}
