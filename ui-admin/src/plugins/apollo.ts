import { defaultDataIdFromObject, InMemoryCache } from "apollo-cache-inmemory";
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

if (!process.env.URL_WEBSOCKET) {
  throw Error("No URL configured for websocket connection");
}

if (!process.env.URL_HTTP) {
  throw Error("No URL configured for http connection");
}

const wsLink = new WebSocketLink({
  uri: process.env.URL_WEBSOCKET,
  options: {
    reconnect: true,
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${store.state.accessToken}`,
    },
  };
});

const httpLink = new HttpLink({
  uri: process.env.URL_HTTP,
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

// TODO: This should be updated when we migrate to Vue-Apollo 4.
const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case "QualtricsSurveyListItem":
        return `QualtricsSurveyListItem:${
          (object as { qualtricsId: string }).qualtricsId
        }`;
      default:
        return defaultDataIdFromObject(object); // fall back to default handling
    }
  },
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: loggingLink.concat(splitLink),
  cache,
  connectToDevTools: true,
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export default apolloProvider;
