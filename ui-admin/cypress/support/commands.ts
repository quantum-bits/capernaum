// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("capSetJWT", () => {
  cy.log("Setting JWT");
  cy.window().then((win) => {
    win.localStorage.setItem(
      "vuex",
      JSON.stringify({
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImZpcnN0TmFtZSI6IkJyb29rIiwibGFzdE5hbWUiOiJUcm91dCIsImVtYWlsIjoiYnJvb2tlQGV4YW1wbGUuY29tIiwicm9sZXMiOltdLCJpYXQiOjE2NTAzMTE5OTh9.XUl7NBFjA5-wzuYVMxcusAdF4gelqn2ES9xALRZfuPw",
      })
    );
  });
});

Cypress.Commands.add("capImportSurvey", () => {
  const qualtricsSurveyId = Cypress.env("qualtricsSurveyId");

  // Delete the survey from the Capernaum database.
  cy.log(`Delete survey ${qualtricsSurveyId} from database`);
  cy.exec(`cd ../server && yarn cli survey delete ${qualtricsSurveyId}`);

  // Visit the Qualtrics page; set a longer-than-default timeout because
  // this is loading from Qualtrics proper, which can take longer than we'd like.
  cy.log(`Import survey ${qualtricsSurveyId} from Qualtrics`);
  cy.visit("/qualtrics");

  // Find and click the button that imports the survey from Qualtrics.
  cy.contains(qualtricsSurveyId, { timeout: 15000 })
    .parent("tr")
    .as("surveyRow")
    .find('button[data-cy="import-btn"]')
    .click();

  // Await completion of the import.
  cy.get("@surveyRow")
    .find('[data-cy="imported-chip"]')
    .contains("Yes", { timeout: 8000 });
});
