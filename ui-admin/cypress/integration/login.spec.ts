describe("Login Page", () => {
  it("logs in to Capernaum", () => {
    cy.visit("/");
    cy.get("input[name='email']").type("brooke@example.com");
    cy.get("input[name='password']").type("Password99");
    cy.contains("Log In").click();
    cy.url().should("contain", "letters");
  });
});

describe("Survey Page", () => {
  it("selects a survey", () => {
    cy.visit("/surveys");
  });
});

describe("Qualtrics Page", () => {
  it("imports a survey", () => {
    cy.visit("/qualtrics");
  });
});
