import { Injectable } from "@nestjs/common";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyResponse } from "@server/src/survey/entities";
import { Group } from "@server/src/group/entities";
import {
  Dimension,
  Prediction,
  PredictionCount,
  SurveyRespondentType,
} from "@server/src/survey/survey.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { ScriptureEngagementPractice } from "@server/src/prediction/entities";
import * as _ from "lodash";

const debug = getDebugger("analytics");

// TODO - Look into whether there is a better way to convert these values
// on their way in from the database, where they appear to be all strings.

interface RawMeanSurveyIndices {
  surveyIndexId: number;
  surveyIndexTitle: string;
  meanSurveyIndex: string;
}

interface RawDimensionData {
  dimensionId: string;
  dimensionTitle: string;
  indexId: string;
  indexTitle: string;
  meanSurveyIndex: string;
}

// TODO: Give the fields here better names (like the other interfaces).
interface RawPredictionData {
  sep_id: string;
  sep_title: string;
  sidx_id: string;
  sidx_title: string;
  sidx_abbreviation: string;
  mean_sidx: string;
}

@Injectable()
export class SurveyAnalyticsService {
  // TODO - Replace these injected repos with the corresponding services. Here and throughout!
  constructor(
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepo: Repository<SurveyResponse>,
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
    @InjectRepository(ScriptureEngagementPractice)
    private readonly scriptureEngagementPracticeRepo: Repository<ScriptureEngagementPractice>
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

      .getRawMany<RawMeanSurveyIndices>();
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

      .getRawMany<RawDimensionData>();
    debug("dimensions for response/group %d", responseOrGroupId);

    const rawDimensionDataByDimId = _.groupBy(
      rawDimensionData,
      (elt) => elt.dimensionId
    );

    const dimensions = _.map(rawDimensionDataByDimId, (rawDimData) => {
      const dimension = new Dimension();
      dimension.id = parseInt(rawDimData[0].dimensionId);
      dimension.title = rawDimData[0].dimensionTitle;
      dimension.details = _.map(rawDimData, (datum) => ({
        indexId: parseInt(datum.indexId),
        indexTitle: datum.indexTitle,
        meanSurveyIndex: parseFloat(datum.meanSurveyIndex),
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
      .innerJoin("sidx.scriptureEngagementPractices", "sep")

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

      .getRawMany<RawPredictionData>();
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
    // Need the `Promise.all()` because each iteration through the `map`
    // function is asynchronous.
    const predictions = Promise.all(
      _.map(rawPredictionDataBySepId, async (rawData) => {
        const prediction = new Prediction();

        prediction.practice =
          await this.scriptureEngagementPracticeRepo.findOne(
            parseInt(rawData[0].sep_id)
          );

        prediction.details = _.map(rawData, (datum) => ({
          surveyIndexTitle: datum.sidx_title,
          surveyIndexAbbreviation: datum.sidx_abbreviation,
          meanResponse: parseFloat(datum.mean_sidx),
        }));

        prediction.predict = _.every(
          rawData,
          (rawDatum) =>
            parseFloat(rawDatum.mean_sidx) >=
            parseFloat(process.env.SEP_PREDICTION_THRESHOLD)
        );
        return prediction;
      })
    );

    debug("predictions %O", predictions);
    return predictions;
  }

  /**
   * Return `PredictionCount` objects for a group.
   * @param groupId
   */
  async countPredictionsPerGroup(groupId: number) {
    const summaryByPracticeId = new Map<number, PredictionCount>();

    // Get the group and all its responses.
    const group = await this.groupRepo.findOneOrFail(groupId, {
      relations: ["surveyResponses"],
    });
    debug("group details %O", group);

    // Process all responses for this group.
    for (const response of group.surveyResponses) {
      // Run the individual prediction for SEP's
      const predictions = await this.predictScriptureEngagementPractices(
        response.id,
        SurveyRespondentType.Individual
      );

      // Handle all the SEP predictions for this individual.
      for (const prediction of predictions) {
        // Skip practices that we don't want in the group count summary.
        if (!prediction.practice.forPredictionCounts) {
          continue;
        }

        // Make sure the map has a null entry for this SEP.
        if (!summaryByPracticeId.has(prediction.practice.id)) {
          summaryByPracticeId.set(prediction.practice.id, {
            practiceId: prediction.practice.id,
            practiceTitle: prediction.practice.title,
            predictCount: 0,
          });
        }

        // If this SEP is predicted for this individual, bump the count.
        if (prediction.predict) {
          const predictionCount = summaryByPracticeId.get(
            prediction.practice.id
          );
          predictionCount.predictCount += 1;
          summaryByPracticeId.set(prediction.practice.id, predictionCount);
        }
      }
    }
    debug("%O", summaryByPracticeId);
    return Array.from(summaryByPracticeId.values());
  }
}
