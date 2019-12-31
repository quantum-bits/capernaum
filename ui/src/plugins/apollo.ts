import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import store from "../store";
import Vue from "vue";
import VueApollo from "vue-apollo";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";

const loggingLink = new ApolloLink((operation, forward) => {
  console.log("OPERATION", operation);
  return forward(operation);
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:3000/graphql",
  options: {
    reconnect: true
  }
});

const authLink = setContext((_, { headers }) => {
  const context = {
    headers: {
      ...headers,
      authorization: `Bearer ${store.state.accessToken}`
    }
  };
  // console.log("CONTEXT", context);
  return context;
});

const httpLink = new HttpLink({
  uri: "http://localhost:3000/graphql"
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Create the apollo client
const apolloClient = new ApolloClient({
  link: loggingLink.concat(splitLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

export default apolloProvider;
