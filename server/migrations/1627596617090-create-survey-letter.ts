import { MigrationInterface, QueryRunner } from "typeorm";
import { LETTER_TYPE_INDIVIDUAL_ID } from "./migration.constants";

export class createSurveyLetter1627596617090 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make the table
    await queryRunner.query(
      `CREATE TABLE "survey_letter" ("id" SERIAL NOT NULL, "surveyId" integer, "letterId" integer, "letterTypeId" integer, CONSTRAINT "UQ_e3c3860159a7a0565293671e0ff" UNIQUE ("surveyId", "letterTypeId"), CONSTRAINT "PK_0825ba67ba87d10cdc616e5123e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_letter" ADD CONSTRAINT "FK_facaecc626053801d984cd9fd73" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_letter" ADD CONSTRAINT "FK_e751a2f8b0d28a804840611f6d3" FOREIGN KEY ("letterId") REFERENCES "letter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    // Get all existing letters.
    const letters = await queryRunner.query("SELECT * FROM letter");

    // Insert survey letters.
    for (const ltr of letters) {
      await queryRunner.query(
        'INSERT INTO survey_letter("surveyId", "letterId", "letterTypeId") VALUES($1, $2, $3)',
        [ltr.surveyId, ltr.id, LETTER_TYPE_INDIVIDUAL_ID]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("survey_letter");
  }
}
