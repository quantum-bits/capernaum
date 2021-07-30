import { MigrationInterface, QueryRunner, Table } from "typeorm";

/**
 * Migrate the prediction table to the new schema.
 */
export class predictionTableEntry1627593617629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the new table.
    await queryRunner.createTable(
      new Table({
        name: "prediction_table_entry_new",
        columns: [
          {
            name: "surveyIndexId",
            type: "int",
            isPrimary: true,
          },
          {
            name: "scriptureEngagementPracticeId",
            type: "int",
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["surveyIndexId"],
            referencedTableName: "survey_index",
            referencedColumnNames: ["id"],
          },
          {
            columnNames: ["scriptureEngagementPracticeId"],
            referencedTableName: "scripture_engagement_practice",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );

    // Map old data to new table.
    const prediction_table_entries = await queryRunner.query(
      "SELECT * FROM prediction_table_entry"
    );

    for (const pte of prediction_table_entries) {
      await queryRunner.query(
        'INSERT INTO prediction_table_entry_new("surveyIndexId", "scriptureEngagementPracticeId") VALUES($1, $2)',
        [pte.surveyIndexId, pte.practiceId]
      );
    }

    // Rename the old table (keeps this migration reversible).
    await queryRunner.renameTable(
      "prediction_table_entry",
      "prediction_table_entry_old"
    );

    // Rename the new table to replace the old one.
    await queryRunner.renameTable(
      "prediction_table_entry_new",
      "prediction_table_entry"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the new table.
    await queryRunner.dropTable("prediction_table_entry");
    // Replace it with the old table.
    await queryRunner.renameTable(
      "prediction_table_entry_old",
      "prediction_table_entry"
    );
  }
}
