// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(() => {
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
