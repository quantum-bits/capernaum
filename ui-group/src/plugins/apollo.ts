import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import Vue from "vue";
import VueApollo from "vue-apollo";

if (!process.env.URL_HTTP) {
  console.log("process: ", process);
  throw Error("No URL configured for http connection");
}

const httpLink = new HttpLink({
  uri: process.env.URL_HTTP,
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export default apolloProvider;
