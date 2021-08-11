import { MigrationInterface, QueryRunner } from "typeorm";
import { LETTER_TYPE_INDIVIDUAL_ID } from "./migration.constants";

/**
 * Migrate lookup tables to new values.
 */
export class lookupTables1627655668100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const letterTypeRows = [
      [LETTER_TYPE_INDIVIDUAL_ID, "individual", "Individual Letter"],
      [2, "group", "Group Letter"],
    ];
    for (const row of letterTypeRows) {
      await queryRunner.query(
        "INSERT INTO letter_type(id, key, description) VALUES($1, $2, $3)",
        row
      );
    }

    // Now that the letter types are available, set up the FK constraint.
    await queryRunner.query(
      `ALTER TABLE "survey_letter" ADD CONSTRAINT "FK_900b6b096c17390f7b62ff1c77c" FOREIGN KEY ("letterTypeId") REFERENCES "letter_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    const groupTypeRows = [
      [5, "Everyone at a particular church", "WHOLE_CHURCH", 5],
      [10, "Sunday School class", "SUNDAY_SCHOOL", 10],
      [15, "Small group at a church", "CHURCH_SMALL_GROUP", 15],
      [
        20,
        "Spiritual life group with people from a variety of churches or not involved with any particular church",
        "LIFE_GROUP",
        20,
      ],
      [25, "People from a para-church organization", "PARA_CHURCH", 25],
      [30, "College spiritual life assessment", "COLLEGE", 30],
      [100, "Other", "OTHER", 100],
    ];
    for (const row of groupTypeRows) {
      await queryRunner.query(
        "INSERT INTO group_type(id, name, code, seq) VALUES($1, $2, $3, $4)",
        row
      );
    }

    // Prior to this migration:
    // ["1", "chart", "Bar Chart"],
    // ["2", "boolean-calculation-results", "Boolean Calculation Results"],
    // ["3", "header", "Header (Top of Letter)"], -- RETIRED
    // ["4", "footer", "Footer (End of Letter)"], -- RETIRED
    // ["5", "boilerplate", "Boilerplate Text"],
    // ["6", "image", "Image"],
    // Now:
    // ["1","boilerplate-text","Boilerplate Text"],
    // ["2","scripture-engagement-prediction","Scripture Engagement Prediction"],
    // ["3","dimension-chart","Dimension Chart"],
    // ["4","image","Image"],
    // ["5","scripture-engagement-count","Scripture Engagement Counts"],
    // ["6","demographics","Group Demographics"],

    // Rename everybody.
    for (const row of [
      [1, "boilerplate-text", "Boilerplate Text"],
      [2, "scripture-engagement-prediction", "Scripture Engagement Prediction"],
      [3, "dimension-chart", "Dimension Chart"],
      [4, "image", "Image"],
      [5, "scripture-engagement-count", "Scripture Engagement Counts"],
      [6, "demographics", "Group Demographics"],
    ]) {
      await queryRunner.query(
        "UPDATE letter_element_type SET key = $2, description= $3 WHERE id = $1",
        row
      );
    }

    // Reassign "chart" (1) to "dimension-chart" (3)
    await queryRunner.query(
      'UPDATE letter_element SET "letterElementTypeId" = 3 WHERE "letterElementTypeId" = 1'
    );

    // Reassign "image" (6) to "image" (4)
    await queryRunner.query(
      'UPDATE letter_element SET "letterElementTypeId" = 4 WHERE "letterElementTypeId" = 6'
    );

    // Reassign "boilerplate" to "boilerplate-text"
    await queryRunner.query(
      'UPDATE letter_element SET "letterElementTypeId" = 1 WHERE "letterElementTypeId" = 5'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM letter_type");
    await queryRunner.query("DELETE FROM group_type");

    for (const row of [
      [1, "chart", "Bar Chart"],
      [2, "boolean-calculation-results", "Boolean Calculation Results"],
      [3, "header", "Header (Top of Letter)"],
      [4, "footer", "Footer (End of Letter)"],
      [5, "boilerplate", "Boilerplate Text"],
      [6, "image", "Image"],
    ]) {
      await queryRunner.query(
        "UPDATE letter_element_type SET key = $2, description= $3 WHERE id = $1",
        row
      );
    }
  }
}
