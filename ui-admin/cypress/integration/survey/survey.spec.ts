describe("Survey Page", () => {
  before(() => {
    cy.capSetJWT();
    cy.capImportSurvey();
    cy.visit("/surveys");
    cy.get('input[data-cy="survey-select"]').parent().click();
    cy.get(".v-menu__content").contains("Cap Testing").click();
  });

  beforeEach(() => {
    cy.capSetJWT();
  });

  describe("manages survey details", () => {
    it("fills out group info", () => {
      cy.get(".v-tab").contains("Details").click();
      cy.contains("Qualtrics Information");

      cy.get('[data-cy="edit-save-cancel-edit-btn"]').click();
      cy.get('input[data-cy="checkbox-okay-for-group"').check({ force: true });
      cy.get('input[data-cy="text-field-public-name"]')
        .clear()
        .type("Group Name for Public Consumption");
      cy.get('input[data-cy="text-field-detailed-description"]')
        .clear()
        .type("This is the one you want!");
      cy.get('[data-cy="edit-save-cancel-save-btn"]').click();
    });
  });

  describe("manages survey dimensions", () => {
    beforeEach(() => {
      cy.get(".v-tab").contains("Dimensions").click();
      cy.contains("Dimensions, Indices, Items");
    });

    it("add dimensions", () => {
      const dimNames = ["Dimension Red", "Dimension Green", "Dimension Blue"];

      // Create each dimension.
      for (const dimName of dimNames) {
        cy.contains("Add Dimension").click();
        cy.get('[data-cy="text-dimension-title"]').type(dimName);
        cy.get('[data-cy="action-btn"]').click();
      }

      // Make sure the dimension is present in the tree.
      for (const dimName of dimNames) {
        cy.get('[data-cy="tree-view"]').contains(dimName);
      }
    });
  });

  describe("manages survey associations", () => {
    it("opens the associations tab", () => {
      cy.get(".v-tab").contains("Associations").click();
      cy.contains("Scripture Engagement Associations");
    });
  });
});
