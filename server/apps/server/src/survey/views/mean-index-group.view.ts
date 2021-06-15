import { ViewColumn, ViewEntity } from "typeorm";
import { Group } from "@server/src/group/entities";
import { MeanSurveyIndexView } from ".";

@ViewEntity({
  name: "mean_survey_index_group",
  expression: (connection) =>
    connection
      .createQueryBuilder(Group, "grp")
      .innerJoin("grp.surveyResponses", "sr")
      .innerJoin("sr.surveyItemResponses", "sir")
      .innerJoin("sir.surveyItem", "sitem")
      .innerJoin("sitem.surveyIndex", "sidx")

      .select("grp.id", "group_id")
      .addSelect("sidx.id", "survey_index_id")
      .addSelect("sidx.title", "survey_index_title")
      .addSelect("AVG(sir.value)", "mean_survey_index")

      .groupBy("group_id")
      .addGroupBy("survey_index_id")
      .addGroupBy("survey_index_title")
      .orderBy("survey_index_title"),
})
export class MeanSurveyIndexGroupView implements MeanSurveyIndexView {
  @ViewColumn({ name: "group_id" }) meanSurveyIndexId: number;
  @ViewColumn({ name: "survey_index_id" }) surveyIndexId: number;
  @ViewColumn({ name: "survey_index_title" }) surveyIndexTitle: string;
  @ViewColumn({ name: "mean_survey_index" }) meanSurveyIndex: number;
}
