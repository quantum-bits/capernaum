import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import store from "../store";
import Vue from "vue";
import VueApollo from "vue-apollo";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";

// HTTP connection to the API
const httpLink = new HttpLink({
  uri: "/graphql"
});

const wsLink = new WebSocketLink({
  uri: "/subscriptions",
  options: {
    reconnect: true
  }
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
  httpLink
);

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

// Create the apollo client
const apolloClient = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: splitLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

export default apolloProvider;
