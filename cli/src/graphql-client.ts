import {config} from "dotenv";
import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client/core";
import fetch from "cross-fetch";

config();

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
