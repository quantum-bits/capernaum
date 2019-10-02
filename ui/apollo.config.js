// Configure Apollo GraphQL.

module.exports = {
  client: {
    service: {
      name: "faraday-client-service",
      // url: "http://localhost:3000/graphql"
      localSchemaFile: "../server/generated-schema.graphql"
    }
  }
};
