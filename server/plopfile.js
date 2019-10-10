module.exports = function(plop) {
  plop.setGenerator("resolver", {
    description: "GraphQL Resolver",
    prompts: [
      {
        type: "input",
        name: "entityBaseName",
        message: "Entity base name (e.g., 'letter-element')"
      }
    ],
    actions: [
      {
        type: "add",
        path: "./{{ entityBaseName }}.resolvers.ts",
        templateFile: "plop-templates/entity-resolver.hbs"
      }
    ]
  });

  plop.setGenerator("property-resolver", {
    description: "Add property resolver",
    prompts: [
      {
        type: "input",
        name: "parentType",
        message: "Parent type (e.g., SurveyLetter)"
      },
      {
        type: "input",
        name: "childType",
        message: "Child type (e.g., Letter)"
      },
      {
        type: "list",
        name: "cardinality",
        message: "Choose cardinality of relationship",
        choices: [
          {
            name: "One child",
            value: "one"
          },
          {
            name: "Many children",
            value: "many"
          }
        ]
      }
    ],
    actions: []
  });
};
