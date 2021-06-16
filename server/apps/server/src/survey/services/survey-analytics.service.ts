import { Injectable } from "@nestjs/common";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyResponse } from "@server/src/survey/entities";
import { Group } from "@server/src/group/entities";
import { Dimension, Prediction } from "@server/src/survey/survey.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { ScriptureEngagementPractice } from "@server/src/prediction/entities";
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

interface RawDimensionData {
  dimensionId: number;
  dimensionTitle: string;
  indexId: number;
  indexTitle: string;
  meanSurveyIndex: number;
}

export enum SurveyRespondentType {
  Individual,
  Group,
}

@Injectable()
export class SurveyAnalyticsService {
  constructor(
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepo: Repository<SurveyResponse>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>
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

  private buildBaseQuery(
    responseOrGroupId: number,
    respondentType: SurveyRespondentType
  ) {
    let qb: SelectQueryBuilder<SurveyResponse | Group>;

    if (respondentType === SurveyRespondentType.Group) {
      qb = this.groupRepo
        .createQueryBuilder("grp")
        .innerJoin("grp.surveyResponses", "sr")
        .where("grp.id = :responseOrGroupId", { responseOrGroupId });
    } else {
      qb = this.surveyResponseRepo
        .createQueryBuilder("sr")
        .where("sr.id = :responseOrGroupId", { responseOrGroupId });
    }
    return qb
      .innerJoin("sr.surveyItemResponses", "sir")
      .innerJoin("sir.surveyItem", "sitem")
      .innerJoin("sitem.surveyIndex", "sidx")
      .innerJoin("sidx.surveyDimension", "sdim");
  }

  calculateMeanSurveyIndices(
    responseOrGroupId: number,
    respondentType: SurveyRespondentType
  ) {
    return this.buildBaseQuery(responseOrGroupId, respondentType)
      .select("sidx.id", "surveyIndexId")
      .addSelect("sidx.title", "surveyIndexTitle")
      .addSelect("AVG(sir.value)", "meanSurveyIndex")

      .groupBy("sidx.id")
      .addGroupBy("sidx.title")

      .orderBy("sidx.title")

      .getRawMany();
  }

  async calculateSurveyDimensions(
    responseOrGroupId: number,
    respondentType: SurveyRespondentType
  ) {
    const rawDimensionData = await this.buildBaseQuery(
      responseOrGroupId,
      respondentType
    )
      .select("sdim.title", "dimensionTitle")
      .addSelect("sdim.id", "dimensionId")
      .addSelect("sidx.title", "indexTitle")
      .addSelect("sidx.id", "indexId")
      .addSelect("AVG(sir.value)", "meanSurveyIndex")

      .groupBy("sdim.title")
      .addGroupBy("sdim.id")
      .addGroupBy("sidx.title")
      .addGroupBy("sidx.id")

      .orderBy("sdim.title")
      .addOrderBy("sidx.title")

      .getRawMany();
    debug("dimensions for response/group %d", responseOrGroupId);

    const rawDimensionDataByDimId = _.groupBy(
      rawDimensionData,
      (elt) => elt.dimensionId
    );

    const dimensions = _.map(rawDimensionDataByDimId, (rawDimData) => {
      const dimension = new Dimension();
      dimension.id = rawDimData[0].dimensionId;
      dimension.title = rawDimData[0].dimensionTitle;
      dimension.details = _.map(rawDimData, (datum) => ({
        indexId: datum.indexId,
        indexTitle: datum.indexTitle,
        meanSurveyIndex: datum.meanSurveyIndex,
      }));
      return dimension;
    });

    debug("dimensions %O", dimensions);
    return dimensions;
  }

  async predictScriptureEngagementPractices(
    responseOrGroupId: number,
    respondentType: SurveyRespondentType
  ) {
    const rawPredictionData = await this.buildBaseQuery(
      responseOrGroupId,
      respondentType
    )
      .innerJoin("sidx.predictionTableEntries", "pte")
      .innerJoin("pte.practice", "sep")

      .select("sep.id", "sep_id")
      .addSelect("sep.title", "sep_title")
      .addSelect("sidx.id", "sidx_id")
      .addSelect("sidx.title", "sidx_title")
      .addSelect("sidx.abbreviation", "sidx_abbreviation")
      .addSelect("AVG(sir.value)", "mean_sidx")

      .andWhere("sidx.useForPredictions")

      .groupBy("sep.id")
      .addGroupBy("sep.title")
      .addGroupBy("sidx.id")
      .addGroupBy("sidx.title")
      .addGroupBy("sidx.abbreviation")

      .orderBy("sep_title")
      .addOrderBy("sidx_title")

      .getRawMany();
    debug("predict engagement for response/group %d", responseOrGroupId);

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
}
