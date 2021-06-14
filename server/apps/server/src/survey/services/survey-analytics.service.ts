import { Injectable } from "@nestjs/common";
import { getDebugger } from "@helpers/debug-factory";
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
import { Repository, SelectQueryBuilder } from "typeorm";
import {
  PredictionTable,
  ScriptureEngagementPractice,
} from "@server/src/prediction/entities";
import * as _ from "lodash";

const debug = getDebugger("analytics");

interface RawPredictionData {
  sep_id: number;
  sep_title: string;
  sidx_id: number;
  sidx_title: string;
  sidx_abbreviation;
  mean_sidx: number;
}

@Injectable()
export class SurveyAnalyticsService {
  // Cache surveys as they are loaded.
  private readonly surveyStructureCache = new Map<number, Survey>();

  constructor(
    private readonly surveyService: SurveyService,
    private readonly surveyResponseService: SurveyResponseService,
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepo: Repository<SurveyResponse>,
    @InjectRepository(PredictionTable)
    private readonly predictionTableRepo: Repository<PredictionTable>
  ) {}

  summarizeResponse(surveyResponseId: number) {
    return this.surveyResponseRepo
      .createQueryBuilder("sr")
      .innerJoinAndSelect("sr.surveyItemResponses", "sir")
      .innerJoinAndSelect("sir.surveyItem", "sitem")
      .innerJoinAndSelect("sitem.surveyIndex", "sidx")
      .innerJoinAndSelect("sidx.surveyDimension", "sdim")
      .where("sr.id = :id", { id: surveyResponseId })
      .getOne();
  }

  async predictScriptureEngagement(
    predictionTableId: number,
    surveyResponseId: number
  ) {
    const rawPredictionData: RawPredictionData[] =
      await this.predictionTableRepo
        .createQueryBuilder("pt")
        .innerJoin("pt.predictionTableEntries", "pte")
        .innerJoin("pte.practice", "sep")
        .innerJoin("pte.surveyIndex", "sidx")
        .innerJoin(
          (qb) => this.meanSurveyIndexSubQuery(qb, surveyResponseId),
          "msi",
          "msi.sidx_id = sidx.id"
        )

        .select("sep.id", "sep_id")
        .addSelect("sep.title", "sep_title")
        .addSelect("sidx.id", "sidx_id")
        .addSelect("sidx.title", "sidx_title")
        .addSelect("sidx.abbreviation", "sidx_abbreviation")
        .addSelect("msi.mean_sidx", "mean_sidx")

        .where("pt.id = :predictionTableId", { predictionTableId })
        .andWhere("sidx.useForPredictions")
        .orderBy("sep_title")

        .getRawMany();
    debug(
      "predict engagement from PT %d for survey response %d",
      predictionTableId,
      surveyResponseId
    );

    // Organize the raw prediction data into an object keyed by SEP ID.
    // Each entry in the object contains an array of raw prediction data
    // (i.e., the associated survey index data, including MSI) for that SEP.
    const rawPredictionDataBySepId = _.groupBy(
      rawPredictionData,
      (elt) => elt.sep_id
    );
    debug("bySepId %O", rawPredictionDataBySepId);

    // Construct an array of `Prediction` objects corresponding to each SEP.
    const predictions = _.map(rawPredictionDataBySepId, (rawPredictionData) => {
      const prediction = new Prediction();
      prediction.practice = new ScriptureEngagementPractice();
      prediction.practice.id = rawPredictionData[0].sep_id;
      prediction.practice.title = rawPredictionData[0].sep_title;
      prediction.details = _.map(rawPredictionData, (datum) => ({
        surveyIndexTitle: datum.sidx_title,
        surveyIndexAbbreviation: datum.sidx_abbreviation,
        meanResponse: datum.mean_sidx,
      }));
      prediction.predict = _.every(
        rawPredictionData,
        (rawPredictionDatum) =>
          rawPredictionDatum.mean_sidx >=
          parseInt(process.env.SEP_PREDICTION_THRESHOLD)
      );
      return prediction;
    });

    debug("predictions %O", predictions);
    return predictions;
  }

  meanSurveyIndexSubQuery(
    qb: SelectQueryBuilder<SurveyResponse>,
    surveyResponseId: number
  ) {
    debug("Create MSI sub-query for %d", surveyResponseId);
    return qb
      .select("sidx.id", "sidx_id")
      .addSelect("AVG(sir.value)", "mean_sidx")
      .addSelect("sidx.title")
      .from(SurveyResponse, "sr")

      .innerJoin("sr.surveyItemResponses", "sir")
      .innerJoin("sir.surveyItem", "sitem")
      .innerJoin("sitem.surveyIndex", "sidx")

      .where("sr.id = :surveyResponseId", { surveyResponseId })
      .groupBy("sidx_id")
      .addGroupBy("sidx.title");
  }

  async meanSurveyIndices(surveyResponseId: number) {
    const qb = this.surveyResponseRepo.createQueryBuilder();
    const msiSubQuery = this.meanSurveyIndexSubQuery(qb, surveyResponseId);
    return msiSubQuery.getRawAndEntities();
  }

  calculateDimensions(surveyResponseId: number) {
    return this.surveyResponseRepo
      .createQueryBuilder("sr")

      .select("sdim.title", "dimensionTitle")
      .addSelect("sdim.id", "dimensionId")
      .addSelect("sidx.title", "indexTitle")
      .addSelect("sidx.id", "indexId")
      .addSelect("AVG(sir.value)", "meanSurveyIndex")

      .innerJoin("sr.surveyItemResponses", "sir")
      .innerJoin("sir.surveyItem", "sitem")
      .innerJoin("sitem.surveyIndex", "sidx")
      .innerJoin("sidx.surveyDimension", "sdim")

      .groupBy("sdim.title")
      .addGroupBy("sdim.id")
      .addGroupBy("sidx.title")
      .addGroupBy("sidx.id")

      .where("sr.id = :id", { id: surveyResponseId })

      .orderBy("sdim.title")
      .addOrderBy("sidx.title")

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
