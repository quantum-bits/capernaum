import { ViewColumn, ViewEntity } from "typeorm";
import { SurveyResponse } from "@server/src/survey/entities";

@ViewEntity({
  name: "mean_survey_index",
  expression: (connection) =>
    connection
      .createQueryBuilder(SurveyResponse, "sr")
      .innerJoin("sr.surveyItemResponses", "sir")
      .innerJoin("sir.surveyItem", "sitem")
      .innerJoin("sitem.surveyIndex", "sidx")

      .select("sr.id", "survey_response_id")
      .addSelect("sidx.id", "survey_index_id")
      .addSelect("sidx.title", "survey_index_title")
      .addSelect("AVG(sir.value)", "mean_survey_index")

      .groupBy("survey_response_id")
      .addGroupBy("survey_index_id")
      .addGroupBy("survey_index_title")
      .orderBy("survey_index_title"),
})
export class MeanSurveyIndexView {
  @ViewColumn({ name: "survey_response_id" }) surveyResponseId: number;
  @ViewColumn({ name: "survey_index_id" }) surveyIndexId: number;
  @ViewColumn({ name: "survey_index_title" }) surveyIndexTitle: string;
  @ViewColumn({ name: "mean_survey_index" }) meanSurveyIndex: number;
}
