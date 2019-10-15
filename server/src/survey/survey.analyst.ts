import { SurveyService } from "./survey.service";
import { SurveyDimension, SurveyIndex } from "./entities";

export default class SurveyAnalyst {
  constructor(private readonly surveyService: SurveyService) {}

  async scoreSurveyDimension(
    surveyDimensionId: number,
    surveyResponseId: number
  ) {
    try {
      console.log("DIMID", surveyDimensionId);
      console.log("SURVEY SERVICE", this.surveyService || "NOT DEFINED");
      const surveyDimension = await this.surveyService.find(SurveyDimension, {
        where: { id: surveyDimensionId }
      });

      console.log("DIMENSION", JSON.stringify(surveyDimension, null, 2));
    } catch (err) {
      console.log("ERROR", err);
      throw err;
    }
  }
}
