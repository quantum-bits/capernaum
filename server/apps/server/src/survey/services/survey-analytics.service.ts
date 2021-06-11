import { Injectable } from "@nestjs/common";
import { getDebugger } from "@helpers/debug-factory";
import { mean } from "lodash";
import { SurveyService } from "@server/src/survey/services/survey.service";
import {
  Survey,
  SurveyDimension,
  SurveyResponse,
} from "@server/src/survey/entities";
import { SurveyResponseService } from "@server/src/survey/services/survey-response.service";
import { QualtricsID } from "@server/src/qualtrics/qualtrics.types";
import { ChartData, Prediction } from "@server/src/survey/survey.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

const debug = getDebugger("analytics");

@Injectable()
export class SurveyAnalyticsService {
  // Cache surveys as they are loaded.
  private readonly surveyStructureCache = new Map<number, Survey>();

  constructor(
    private readonly surveyService: SurveyService,
    private readonly surveyResponseService: SurveyResponseService,
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepo: Repository<SurveyResponse>
  ) {}

  summarizeResponse(surveyResponseId: number) {
    return this.surveyResponseRepo
      .createQueryBuilder("sr")
      .innerJoinAndSelect("sr.surveyItemResponses", "sir")
      .innerJoinAndSelect("sir.surveyItem", "sitem")
      .innerJoinAndSelect("sitem.surveyIndex", "sindex")
      .innerJoinAndSelect("sindex.surveyDimension", "sdim")
      .where("sr.id = :id", { id: surveyResponseId })
      .getOne();
  }

  calculateDimensions(surveyResponseId: number) {
    return this.surveyResponseRepo
      .createQueryBuilder("sr")

      .select("sdim.title", "dimensionTitle")
      .groupBy("sdim.title")
      .orderBy("sdim.title")

      .addSelect("sdim.id", "dimensionId")
      .addGroupBy("sdim.id")

      .addSelect("sindex.title", "indexTitle")
      .addGroupBy("sindex.title")
      .addOrderBy("sindex.title")

      .addSelect("sindex.id", "indexId")
      .addGroupBy("sindex.id")

      .addSelect("AVG(sir.value)", "meanSurveyIndex")

      .innerJoin("sr.surveyItemResponses", "sir")
      .innerJoin("sir.surveyItem", "sitem")
      .innerJoin("sitem.surveyIndex", "sindex")
      .innerJoin("sindex.surveyDimension", "sdim")

      .where("sr.id = :id", { id: surveyResponseId })
      .getRawMany();
  }

  // Make sure the survey with the given ID is cached.
  private async ensureSurveyLoaded(surveyId: number) {
    if (!this.surveyStructureCache.has(surveyId)) {
      const survey = await this.surveyService.readStructure(surveyId);
      this.surveyStructureCache.set(surveyId, survey);
      debug(
        "Cached survey %d (%s - %s)",
        surveyId,
        survey.qualtricsId,
        survey.qualtricsName
      );
    }
  }

  async analyzeResponse(responseId: number) {
    // Read the content of the response.
    const response = await this.surveyResponseService.readForAnalysis(
      responseId
    );

    // Make sure the associated survey is cached.
    await this.ensureSurveyLoaded(response.survey.id);

    // For each response it, map its Qualtrics ID to the respondent's numeric answer.
    const responseByQualtricsId = new Map<QualtricsID, number>(
      response.surveyItemResponses.map((resp) => [
        resp.surveyItem.qualtricsId,
        resp.value,
      ])
    );
  }

  predictScriptureEngagement(surveyResponse: SurveyResponse) {
    const predictions: Prediction[] = [];
    throw Error("Unimplemented");
    return predictions;
  }

  public chartData(surveyDimension: SurveyDimension): ChartData {
    return undefined;
  }

  // TODO - Rewrite - Was in survey-dimension.ts
  // /**
  //  * The bar chart in the response letter corresponds to a survey dimension.
  //  * Each bar represents a survey index within the survey dimension.
  //  * The value of each bar is the mean of all the survey items (questions) associated with the index.
  //  */
  // public chartData(): ChartData {
  //   const chartEntries = this.surveyIndices.map((surveyIndex) => {
  //     return {
  //       title: surveyIndex.title,
  //       value: surveyIndex.meanResponse(),
  //     };
  //   });
  //
  //   return new ChartData(this.title, chartEntries);
  // }
}