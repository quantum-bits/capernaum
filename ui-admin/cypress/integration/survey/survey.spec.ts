describe("Survey Page", () => {
  before(() => {
    cy.capSetJWT();
    cy.capImportSurvey();
  });

  it("imports a survey", () => {
    cy.visit("/surveys");
  });
});
