describe("Login Page", () => {
  const capUser = Cypress.env("capUser");

  before(() => {
    cy.log(`Refresh user ${capUser.email}`);
    cy.exec(`cd ../server && yarn cli user delete ${capUser.email}`);
    cy.exec(
      `cd ../server && yarn cli user create ${capUser.firstName} ${capUser.lastName} ${capUser.email} ${capUser.password}`
    );
  });

  it("logs in using the UI", () => {
    cy.visit("/");
    cy.location("pathname").should("equal", "/login");

    cy.get("input[name='email']").type(capUser.email);
    cy.get("input[name='password']").type(capUser.password);
    cy.get('[data-cy="login"]').click();

    cy.location("pathname").should("equal", "/letters");
    cy.contains("CapernaumAdmin").should("be.visible");
  });
});

// Credits
//   https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/logging-in__jwt/cypress/integration/using-ui-spec.js
