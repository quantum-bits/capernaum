describe("log in", () => {
  it("logs in to Capernaum", () => {
    cy.visit("/");
    cy.get("input[name='email']").type("brooke@example.com");
    cy.get("input[name='password']").type("Password99");
    cy.contains("Log In").click();
    cy.url().should("contain", "letters");
  });
});
