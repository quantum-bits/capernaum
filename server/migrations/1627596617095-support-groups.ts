import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Migrate schema changes in support of group reporting.
 */
export class supportGroups1627596617095 implements MigrationInterface {
  name = "supportGroups1627596617095";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "letter" DROP CONSTRAINT "FK_4e5478ecc0c02fb82105d75d351"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" DROP CONSTRAINT "FK_dc94447a3cabad70eb2c96f5e1d"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" DROP CONSTRAINT "FK_4698620c2fcf96fdbabb09f3844"`
    );
    await queryRunner.query(
      `ALTER TABLE "prediction_table_entry" DROP CONSTRAINT "FK_8cab62e377052df8bf214485839"`
    );
    await queryRunner.query(
      `ALTER TABLE "scripture_engagement_practice" RENAME COLUMN "sequence" TO "forPredictionCounts"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item" RENAME COLUMN "sequence" TO "qualtricsName"`
    );
    await queryRunner.query(
      `CREATE TABLE "letter_type" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_659927f02c8974b814d99680adc" PRIMARY KEY ("id")); COMMENT ON COLUMN "letter_type"."key" IS 'Letter type name'; COMMENT ON COLUMN "letter_type"."description" IS 'Letter type description'`
    );
    await queryRunner.query(
      `CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "otherTypeName" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "closedAfter" TIMESTAMP NOT NULL, "reportSent" TIMESTAMP, "adminFirstName" character varying NOT NULL, "adminLastName" character varying NOT NULL, "adminEmail" character varying NOT NULL, "codeWord" character varying NOT NULL, "adminComments" character varying NOT NULL DEFAULT '', "plannedInvitees" integer NOT NULL DEFAULT '1', "typeId" integer, "surveyId" integer, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id")); COMMENT ON COLUMN "group"."name" IS 'Group name'; COMMENT ON COLUMN "group"."otherTypeName" IS 'Name for ''other'' type '; COMMENT ON COLUMN "group"."closedAfter" IS 'Date when survey closes'; COMMENT ON COLUMN "group"."reportSent" IS 'Group report sent'; COMMENT ON COLUMN "group"."adminFirstName" IS 'Group administrator first name'; COMMENT ON COLUMN "group"."adminLastName" IS 'Group administrator last name'; COMMENT ON COLUMN "group"."adminEmail" IS 'Group administrator email address'; COMMENT ON COLUMN "group"."codeWord" IS 'Survey code word used by group'; COMMENT ON COLUMN "group"."adminComments" IS 'Comments from administrator'; COMMENT ON COLUMN "group"."plannedInvitees" IS 'Planned invitee count'`
    );
    await queryRunner.query(
      `CREATE TABLE "group_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "seq" integer NOT NULL DEFAULT '-1', CONSTRAINT "PK_6a9ecd4f5f272c9a780c5ca8094" PRIMARY KEY ("id")); COMMENT ON COLUMN "group_type"."name" IS 'Group name (e.g., ''Small Group'')'; COMMENT ON COLUMN "group_type"."code" IS 'Group code (e.g., ''small-group'')'; COMMENT ON COLUMN "group_type"."seq" IS 'Sequence number'`
    );
    await queryRunner.query(
      `CREATE TABLE "letter_type_letter_element_type" ("letterTypeId" integer NOT NULL, "letterElementTypeId" integer NOT NULL, CONSTRAINT "PK_ad935eca5f4613044a76a1a46c5" PRIMARY KEY ("letterTypeId", "letterElementTypeId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_afaa63ab741c43b84456a658b6" ON "letter_type_letter_element_type" ("letterTypeId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_39e898e331a3b46179736d00d1" ON "letter_type_letter_element_type" ("letterElementTypeId") `
    );
    await queryRunner.query(
      `ALTER TABLE "survey_dimension" DROP COLUMN "sequence"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" DROP COLUMN "groupCode"`
    );
    await queryRunner.query(`ALTER TABLE "letter" DROP COLUMN "isFrozen"`);
    await queryRunner.query(
      `ALTER TABLE "letter" DROP CONSTRAINT "UQ_4e5478ecc0c02fb82105d75d351"`
    );
    await queryRunner.query(`ALTER TABLE "letter" DROP COLUMN "surveyId"`);
    await queryRunner.query(
      `ALTER TABLE "survey_response" ADD "codeWord" character varying`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."codeWord" IS 'Group code word'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ADD "groupId" integer`
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "importedDate" TIMESTAMP`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."importedDate" IS 'When this survey was imported from Qualtrics'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "okayForGroup" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."okayForGroup" IS 'Make this survey available to groups?'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "publicName" character varying NOT NULL DEFAULT ''`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."publicName" IS 'Public name for survey (e.g., in group sign-up)'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey" ADD "detailedDescription" character varying NOT NULL DEFAULT ''`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."detailedDescription" IS 'Detailed description of this survey; mostly for group use'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_role"."name" IS 'Role name'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user_role"."description" IS 'Role description'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."email" IS 'Email address'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."firstName" IS 'First name'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."lastName" IS 'Last name'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."password" IS 'Encrypted password'`
    );
    await queryRunner.query(`COMMENT ON COLUMN "event"."type" IS 'event type'`);
    await queryRunner.query(
      `COMMENT ON COLUMN "event"."details" IS 'event details'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_dimension" DROP CONSTRAINT "FK_93c559c31da40ed7161ae039fc0"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_dimension"."title" IS 'Title of this dimension (e.g., ''Focus on Prayer'')'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_dimension" ALTER COLUMN "surveyId" DROP NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scripture_engagement_practice"."title" IS 'Practice title'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scripture_engagement_practice"."description" IS 'Description of this practice'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scripture_engagement_practice"."moreInfoUrl" IS 'URL for more information on practice'`
    );
    await queryRunner.query(
      `ALTER TABLE "scripture_engagement_practice" DROP COLUMN "forPredictionCounts"`
    );
    await queryRunner.query(
      `ALTER TABLE "scripture_engagement_practice" ADD "forPredictionCounts" boolean NOT NULL DEFAULT true`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scripture_engagement_practice"."forPredictionCounts" IS 'Include this SEP in prediction counts?'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_index" DROP CONSTRAINT "FK_6a49eeabfd97f67847735a8f9ba"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_index"."useForPredictions" IS 'Use this index in prediction tables?'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_index"."abbreviation" IS 'Abbreviation for this index (e.g., ''FOG'')'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_index"."title" IS 'Title of this index'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_index" ALTER COLUMN "surveyDimensionId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" DROP CONSTRAINT "FK_325dc8ed7bbdea328af1670dc0a"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."email" IS 'Respondent''s email address'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."qualtricsResponseId" IS 'Qualtrics response ID (e.g., R_...)'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."startDate" IS 'When survey was started'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."endDate" IS 'When survey was completed'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."recordedDate" IS 'When survey was recorded'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."status" IS 'Type of response'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."progress" IS 'Percent complete'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."duration" IS 'Time to complete (seconds)'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."finished" IS '1 = Survey complete and submitted, 0 = otherwise'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."ipAddress" IS 'Respondent''s IP address'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."latitude" IS 'Respondent''s latitude'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."longitude" IS 'Respondent''s longitude'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ALTER COLUMN "surveyId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" DROP CONSTRAINT "FK_1c00a85c96296e2cdbf7e0ba06d"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" DROP CONSTRAINT "FK_4ddb45468338c1b73263c6dd5be"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item_response"."label" IS 'Qualtrics question label'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item_response"."value" IS 'Qualtrics question response'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" ALTER COLUMN "surveyResponseId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" ALTER COLUMN "surveyItemId" DROP NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item"."qualtricsId" IS 'Qualtrics identifier (value of key in \`questions\` object)'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item" DROP COLUMN "qualtricsName"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item" ADD "qualtricsName" character varying`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item"."qualtricsName" IS 'Qualtrics \`questionName\` field'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item"."qualtricsText" IS 'Qualtrics \`questionText\` field'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter_element_type"."key" IS 'Letter element type name'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter_element_type"."description" IS 'Letter element type description'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter"."title" IS 'Letter title'`
    );
    await queryRunner.query(`ALTER TABLE "letter" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "letter" ADD "description" character varying NOT NULL DEFAULT 'Update description!'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter"."description" IS 'Description of letter'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter"."emailMessage" IS 'Email message to go out with letter'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "image"."originalName" IS 'Original name of image file'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "image"."mimeType" IS 'MIME encoding for this image'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "image"."uuid" IS 'Internal unique ID'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "image"."title" IS 'Image title from user'`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" DROP CONSTRAINT "FK_dd4be5ff84dae4c0b3e9219f9c7"`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" DROP CONSTRAINT "FK_a042c6842ce98f533abf44c9972"`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" DROP CONSTRAINT "FK_00125b894ec3ebc37b4784e354b"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter_element"."sequence" IS 'sequence number'`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ALTER COLUMN "textDelta" DROP NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter_element"."textDelta" IS 'Quill text delta'`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ALTER COLUMN "letterId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ALTER COLUMN "letterElementTypeId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" DROP CONSTRAINT "REL_00125b894ec3ebc37b4784e354"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."qualtricsId" IS 'Unique identifier for this survey on Qualtrics'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."qualtricsName" IS 'Name of this survey on Qualtrics'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."qualtricsModDate" IS 'Date and time at which this survey was modified on Qualtrics'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."emailKey" IS 'Key of response value containing email address'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."groupCodeKey" IS 'Key of response value containing group code'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "machine"."name" IS 'Machine name'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "machine"."hostName" IS 'Host name (e.g., FQDN)'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "machine"."active" IS 'Is this machine active?'`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8cab62e377052df8bf21448583" ON "prediction_table_entry" ("surveyIndexId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ef0b7e4ba98b0b2b752f82462a" ON "prediction_table_entry" ("scriptureEngagementPracticeId") `
    );
    await queryRunner.query(
      `ALTER TABLE "survey_dimension" ADD CONSTRAINT "FK_93c559c31da40ed7161ae039fc0" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_index" ADD CONSTRAINT "FK_6a49eeabfd97f67847735a8f9ba" FOREIGN KEY ("surveyDimensionId") REFERENCES "survey_dimension"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ADD CONSTRAINT "FK_5c7115eb6d555b74c8afa2e3f21" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ADD CONSTRAINT "FK_325dc8ed7bbdea328af1670dc0a" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" ADD CONSTRAINT "FK_1c00a85c96296e2cdbf7e0ba06d" FOREIGN KEY ("surveyResponseId") REFERENCES "survey_response"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" ADD CONSTRAINT "FK_4ddb45468338c1b73263c6dd5be" FOREIGN KEY ("surveyItemId") REFERENCES "survey_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ADD CONSTRAINT "FK_dd4be5ff84dae4c0b3e9219f9c7" FOREIGN KEY ("letterId") REFERENCES "letter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ADD CONSTRAINT "FK_a042c6842ce98f533abf44c9972" FOREIGN KEY ("letterElementTypeId") REFERENCES "letter_element_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ADD CONSTRAINT "FK_00125b894ec3ebc37b4784e354b" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "FK_4c8e5fb303da3b6e4a05c7bb62b" FOREIGN KEY ("typeId") REFERENCES "group_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "group" ADD CONSTRAINT "FK_b8e09f9d14017169e759d13fb81" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" ADD CONSTRAINT "FK_dc94447a3cabad70eb2c96f5e1d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" ADD CONSTRAINT "FK_4698620c2fcf96fdbabb09f3844" FOREIGN KEY ("userRoleId") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "prediction_table_entry" ADD CONSTRAINT "FK_8cab62e377052df8bf214485839" FOREIGN KEY ("surveyIndexId") REFERENCES "survey_index"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_type_letter_element_type" ADD CONSTRAINT "FK_afaa63ab741c43b84456a658b67" FOREIGN KEY ("letterTypeId") REFERENCES "letter_type"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_type_letter_element_type" ADD CONSTRAINT "FK_39e898e331a3b46179736d00d17" FOREIGN KEY ("letterElementTypeId") REFERENCES "letter_element_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "letter_type_letter_element_type" DROP CONSTRAINT "FK_39e898e331a3b46179736d00d17"`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_type_letter_element_type" DROP CONSTRAINT "FK_afaa63ab741c43b84456a658b67"`
    );
    await queryRunner.query(
      `ALTER TABLE "prediction_table_entry" DROP CONSTRAINT "FK_8cab62e377052df8bf214485839"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" DROP CONSTRAINT "FK_4698620c2fcf96fdbabb09f3844"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" DROP CONSTRAINT "FK_dc94447a3cabad70eb2c96f5e1d"`
    );
    await queryRunner.query(
      `ALTER TABLE "group" DROP CONSTRAINT "FK_b8e09f9d14017169e759d13fb81"`
    );
    await queryRunner.query(
      `ALTER TABLE "group" DROP CONSTRAINT "FK_4c8e5fb303da3b6e4a05c7bb62b"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_letter" DROP CONSTRAINT "FK_900b6b096c17390f7b62ff1c77c"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_letter" DROP CONSTRAINT "FK_e751a2f8b0d28a804840611f6d3"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_letter" DROP CONSTRAINT "FK_facaecc626053801d984cd9fd73"`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" DROP CONSTRAINT "FK_00125b894ec3ebc37b4784e354b"`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" DROP CONSTRAINT "FK_a042c6842ce98f533abf44c9972"`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" DROP CONSTRAINT "FK_dd4be5ff84dae4c0b3e9219f9c7"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" DROP CONSTRAINT "FK_4ddb45468338c1b73263c6dd5be"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" DROP CONSTRAINT "FK_1c00a85c96296e2cdbf7e0ba06d"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" DROP CONSTRAINT "FK_325dc8ed7bbdea328af1670dc0a"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" DROP CONSTRAINT "FK_5c7115eb6d555b74c8afa2e3f21"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_index" DROP CONSTRAINT "FK_6a49eeabfd97f67847735a8f9ba"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_dimension" DROP CONSTRAINT "FK_93c559c31da40ed7161ae039fc0"`
    );
    await queryRunner.query(`DROP INDEX "IDX_ef0b7e4ba98b0b2b752f82462a"`);
    await queryRunner.query(`DROP INDEX "IDX_8cab62e377052df8bf21448583"`);
    await queryRunner.query(`COMMENT ON COLUMN "machine"."active" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "machine"."hostName" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "machine"."name" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."groupCodeKey" IS NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "survey"."emailKey" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."qualtricsModDate" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."qualtricsName" IS NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "survey"."qualtricsId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "letter_element" ADD CONSTRAINT "REL_00125b894ec3ebc37b4784e354" UNIQUE ("imageId")`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ALTER COLUMN "letterElementTypeId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ALTER COLUMN "letterId" SET NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter_element"."textDelta" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ALTER COLUMN "textDelta" SET NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter_element"."sequence" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ADD CONSTRAINT "FK_00125b894ec3ebc37b4784e354b" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ADD CONSTRAINT "FK_a042c6842ce98f533abf44c9972" FOREIGN KEY ("letterElementTypeId") REFERENCES "letter_element_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "letter_element" ADD CONSTRAINT "FK_dd4be5ff84dae4c0b3e9219f9c7" FOREIGN KEY ("letterId") REFERENCES "letter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`COMMENT ON COLUMN "image"."title" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "image"."uuid" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "image"."mimeType" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "image"."originalName" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "letter"."emailMessage" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter"."description" IS 'Description of letter'`
    );
    await queryRunner.query(`ALTER TABLE "letter" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "letter" ADD "description" text NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "letter"."title" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "letter_element_type"."description" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "letter_element_type"."key" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item"."qualtricsText" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item"."qualtricsName" IS 'Qualtrics \`questionName\` field'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item" DROP COLUMN "qualtricsName"`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item" ADD "qualtricsName" integer NOT NULL DEFAULT '-1'`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item"."qualtricsId" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" ALTER COLUMN "surveyItemId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" ALTER COLUMN "surveyResponseId" SET NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item_response"."value" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_item_response"."label" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" ADD CONSTRAINT "FK_4ddb45468338c1b73263c6dd5be" FOREIGN KEY ("surveyItemId") REFERENCES "survey_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_item_response" ADD CONSTRAINT "FK_1c00a85c96296e2cdbf7e0ba06d" FOREIGN KEY ("surveyResponseId") REFERENCES "survey_response"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ALTER COLUMN "surveyId" SET NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."longitude" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."latitude" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."ipAddress" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."finished" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."duration" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."progress" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."status" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."recordedDate" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."endDate" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."startDate" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."qualtricsResponseId" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."email" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ADD CONSTRAINT "FK_325dc8ed7bbdea328af1670dc0a" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_index" ALTER COLUMN "surveyDimensionId" SET NOT NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "survey_index"."title" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_index"."abbreviation" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_index"."useForPredictions" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_index" ADD CONSTRAINT "FK_6a49eeabfd97f67847735a8f9ba" FOREIGN KEY ("surveyDimensionId") REFERENCES "survey_dimension"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scripture_engagement_practice"."forPredictionCounts" IS 'Include this SEP in prediction counts?'`
    );
    await queryRunner.query(
      `ALTER TABLE "scripture_engagement_practice" DROP COLUMN "forPredictionCounts"`
    );
    await queryRunner.query(
      `ALTER TABLE "scripture_engagement_practice" ADD "forPredictionCounts" integer NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scripture_engagement_practice"."moreInfoUrl" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scripture_engagement_practice"."description" IS NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "scripture_engagement_practice"."title" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_dimension" ALTER COLUMN "surveyId" SET NOT NULL`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_dimension"."title" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_dimension" ADD CONSTRAINT "FK_93c559c31da40ed7161ae039fc0" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`COMMENT ON COLUMN "event"."details" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "event"."type" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."password" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."lastName" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."firstName" IS NULL`);
    await queryRunner.query(`COMMENT ON COLUMN "user"."email" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "user_role"."description" IS NULL`
    );
    await queryRunner.query(`COMMENT ON COLUMN "user_role"."name" IS NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."detailedDescription" IS 'Detailed description of this survey; mostly for group use'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey" DROP COLUMN "detailedDescription"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."publicName" IS 'Public name for survey (e.g., in group sign-up)'`
    );
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "publicName"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."okayForGroup" IS 'Make this survey available to groups?'`
    );
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "okayForGroup"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "survey"."importedDate" IS 'When this survey was imported from Qualtrics'`
    );
    await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "importedDate"`);
    await queryRunner.query(
      `ALTER TABLE "survey_response" DROP COLUMN "groupId"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "survey_response"."codeWord" IS 'Group code word'`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" DROP COLUMN "codeWord"`
    );
    await queryRunner.query(`ALTER TABLE "letter" ADD "surveyId" integer`);
    await queryRunner.query(
      `ALTER TABLE "letter" ADD CONSTRAINT "UQ_4e5478ecc0c02fb82105d75d351" UNIQUE ("surveyId")`
    );
    await queryRunner.query(
      `ALTER TABLE "letter" ADD "isFrozen" boolean NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_response" ADD "groupCode" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "survey_dimension" ADD "sequence" integer NOT NULL`
    );
    await queryRunner.query(`DROP INDEX "IDX_39e898e331a3b46179736d00d1"`);
    await queryRunner.query(`DROP INDEX "IDX_afaa63ab741c43b84456a658b6"`);
    await queryRunner.query(`DROP TABLE "letter_type_letter_element_type"`);
    await queryRunner.query(`DROP TABLE "group_type"`);
    await queryRunner.query(`DROP TABLE "group"`);
    await queryRunner.query(`DROP TABLE "survey_letter"`);
    await queryRunner.query(`DROP TABLE "letter_type"`);
    await queryRunner.query(
      `ALTER TABLE "survey_item" RENAME COLUMN "qualtricsName" TO "sequence"`
    );
    await queryRunner.query(
      `ALTER TABLE "scripture_engagement_practice" RENAME COLUMN "forPredictionCounts" TO "sequence"`
    );
    await queryRunner.query(
      `ALTER TABLE "prediction_table_entry" ADD CONSTRAINT "FK_8cab62e377052df8bf214485839" FOREIGN KEY ("surveyIndexId") REFERENCES "survey_index"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" ADD CONSTRAINT "FK_4698620c2fcf96fdbabb09f3844" FOREIGN KEY ("userRoleId") REFERENCES "user_role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" ADD CONSTRAINT "FK_dc94447a3cabad70eb2c96f5e1d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "letter" ADD CONSTRAINT "FK_4e5478ecc0c02fb82105d75d351" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
