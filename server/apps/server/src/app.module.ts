import { Module, OnModuleInit } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SurveyModule } from "./survey/survey.module";
import { PredictionModule } from "./prediction/prediction.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { options as typeORMConfig } from "./typeorm-config";
import { WriterModule } from "./writer/writer.module";
import { QualtricsModule } from "./qualtrics/qualtrics.module";
import { MachineModule } from "./machine/machine.module";
import { GroupModule } from "./group/group.module";
import { getDebugger } from "@helpers/debug-factory";
import { getManager } from "typeorm";

const debug = getDebugger("app");

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeORMConfig,
      synchronize: true,
      retryAttempts: 3,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "generated-schema.graphql",
      installSubscriptionHandlers: true,
      context: ({ req }) => ({ req }),
    }),
    SurveyModule,
    PredictionModule,
    AuthModule,
    MailModule,
    WriterModule,
    QualtricsModule,
    MachineModule,
    GroupModule,
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    const manager = getManager();

    // await manager.query(msi_view);
    // debug("created MSI view");
    //
    // await manager.query(group_msi_view);
    // debug("created group MSI view");
  }
}

const msi_view = `
-- The mean survey index view for a single survey response.
CREATE OR REPLACE VIEW mean_survey_index AS
SELECT sr.id              AS "sr_id",
       "sidx"."id"        AS "sidx_id",
       "sidx"."title"     AS "sidx_title",
       AVG("sir"."value") AS "mean_sidx"
FROM "survey_response" "sr"
         INNER JOIN "survey_item_response" "sir" ON "sir"."surveyResponseId" = "sr"."id"
         INNER JOIN "survey_item" "sitem" ON "sitem"."id" = "sir"."surveyItemId"
         INNER JOIN "survey_index" "sidx" ON "sidx"."id" = "sitem"."surveyIndexId"
GROUP BY sr_id, sidx_id, sidx_title
ORDER BY sidx_title;
`;

const group_msi_view = `
-- The mean survey index view for a group's response(s).
CREATE OR REPLACE VIEW group_mean_survey_index AS
SELECT grp.id         AS grp_id,
       sidx.id        AS sidx_id,
       sidx.title     AS sidx_title,
       AVG(sir.value) AS mean_sidx
FROM "group" grp
         INNER JOIN survey_response sr ON "grp".id = sr."groupId"
         INNER JOIN survey_item_response sir ON sr.id = sir."surveyResponseId"
         INNER JOIN survey_item sitem ON sitem.id = sir."surveyItemId"
         INNER JOIN survey_index sidx ON sitem."surveyIndexId" = sidx.id
GROUP BY grp_id, sidx_id, sidx_title;
`;
