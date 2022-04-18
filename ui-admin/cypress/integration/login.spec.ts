describe("Login Page", () => {
  before(() => {
    cy.exec("cd ../server && yarn cli user delete brooke@example.com");
    cy.exec(
      "cd ../server && yarn cli user create Brook Trout brooke@example.com password"
    );
  });

  it("logs in using the UI", () => {
    cy.visit("/");
    cy.location("pathname").should("equal", "/login");

    cy.get("input[name='email']").type("brooke@example.com");
    cy.get("input[name='password']").type("password");
    cy.get('[data-cy="login"]').click();

    cy.location("pathname").should("equal", "/letters");
    cy.contains("CapernaumAdmin").should("be.visible");
  });
});

// Credits
//   https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/logging-in__jwt/cypress/integration/using-ui-spec.js
