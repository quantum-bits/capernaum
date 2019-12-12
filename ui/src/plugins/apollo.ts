import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import Vue from "vue";
import VueApollo from "vue-apollo";

// HTTP connection to the API

console.log(`WE'RE IN ${JSON.stringify(process.env, null, 2)} MODE`);

const httpLink = createHttpLink({
  uri: "/graphql"
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

export default apolloProvider;
