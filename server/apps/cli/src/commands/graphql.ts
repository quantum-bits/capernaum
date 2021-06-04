import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import fetch from "cross-fetch";
import { gql } from "@apollo/client/core";
import prettyFormat from "pretty-format";
import Debug from "debug";
import { Command } from "commander";

const debug = Debug("graphql");

export function graphqlClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: "http://localhost:3000/graphql",
      fetch,
      headers: {
        Authorization: process.env.AUTH_HEADER,
      },
    }),
    cache: new InMemoryCache(),
  });
}

export function graphQLQuery(queryString: string, options, command: Command) {
  // debug("queryString '%s'", queryString);
  // debug("options %o", options);
  // debug("command %O", command);
  // debug("ARGS %O", command.args);
  const theQuery = command.args.join(" ");
  debug("theQuery '%s'", theQuery);

  graphqlClient()
    .query({
      query: gql(theQuery),
    })
    .then((response) => console.log(prettyFormat(response)));
}
