describe("log in", () => {
  it("logs in to Capernaum", () => {
    cy.visit("/");
    cy.get("input[name='email']").type("tom.nurkkala@gmail.com");
    cy.get("input[name='password']").type("Password99");
    cy.contains("Log In").click();
    cy.url().should("contain", "letters");
  });
});
