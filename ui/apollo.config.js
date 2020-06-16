// Configure Apollo GraphQL.

module.exports = {
  client: {
    service: {
      name: "capernaum-client",
      localSchemaFile: "../server/generated-schema.graphql",
    },
  },
};
