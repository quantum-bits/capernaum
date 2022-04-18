describe("Qualtrics Page", () => {
  before(() => {
    cy.exec("cd ../server && yarn cli survey delete SV_0NyRAwZoSOSKPoW");
  });

  it("imports a survey", () => {
    cy.visit("/qualtrics");
    cy.log("SURVEY SPEC");
    cy.contains("SV_0NyRAwZoSOSKPoW")
      .parent("tr")
      .find('button[data-cy="import-btn"]')
      .click();
  });
});
