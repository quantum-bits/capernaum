import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import {
  ResponseSummary,
  SurveyItemResponse,
  SurveyResponse,
} from "@server/src/survey/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("response");

@Injectable()
export class SurveyResponseService extends BaseService<SurveyResponse> {
  constructor(
    @InjectRepository(SurveyResponse)
    private readonly repo: Repository<SurveyResponse>
  ) {
    super(repo);
  }

  readOne(id: number) {
    return this.repo.findOne(id, {
      relations: ["survey", "surveyItemResponses"],
    });
  }

  readForAnalysis(id: number) {
    return this.repo.findOne(id, {
      relations: [
        "survey",
        "surveyItemResponses",
        "surveyItemResponses.surveyItems",
      ],
    });
  }

  readComplete(responseId: number) {
    debug("get complete response %d", responseId);

    return this.repo
      .createQueryBuilder("surveyResponse")
      .innerJoinAndSelect("surveyResponse.survey", "survey")
      .innerJoinAndSelect("survey.surveyDimensions", "dimensions")
      .innerJoinAndSelect("dimensions.surveyIndices", "indices")
      .innerJoinAndSelect("indices.surveyItems", "items")
      .innerJoinAndSelect("items.surveyItemResponses", "responseItems")
      .leftJoinAndSelect("indices.predictionTableEntries", "tableEntries")
      .leftJoinAndSelect("tableEntries.practice", "practice")
      .where("surveyResponse.id = :responseId", { responseId })
      .andWhere("responseItems.surveyResponseId = :responseId", {
        responseId,
      })
      .getOne();
  }

  static async _deleteHelper(manager: EntityManager, surveyResponseId: number) {
    // Delete responses to each question.
    await manager.delete(SurveyItemResponse, {
      surveyResponseId,
    });

    return manager.delete(SurveyResponse, {
      id: surveyResponseId,
    });
  }

  async delete(surveyResponseId: number) {
    return this.repo.manager.transaction(async (manager) => {
      const result = await SurveyResponseService._deleteHelper(
        manager,
        surveyResponseId
      );
      return result.affected;
    });
  }

  /**
   * Summarize a survey response for use in debugging/validation.
   */
  public summarize(surveyResponse: SurveyResponse): ResponseSummary {
    return {
      id: surveyResponse.id,
      qualtricsResponseId: surveyResponse.qualtricsResponseId,
      email: surveyResponse.email,
      date: surveyResponse.endDate,

      surveySummary: {
        id: surveyResponse.survey.id,
        title: surveyResponse.survey.qualtricsName,
        qualtricsId: surveyResponse.survey.qualtricsId,
        qualtricsName: surveyResponse.survey.qualtricsName,
      },

      dimensionSummaries: surveyResponse.survey.surveyDimensions.map(
        (dimension) => ({
          id: dimension.id,
          title: dimension.title,
          indexSummaries: dimension.surveyIndices.map((index) => ({
            id: index.id,
            title: index.title,
            abbreviation: index.abbreviation,
            meanResponse: index.meanResponse(),
            itemSummaries: index.surveyItems.map((item) => {
              const itemResponse = item.surveyItemResponse();
              return {
                id: item.id,
                qualtricsId: item.qualtricsId,
                qualtricsText: item.qualtricsText,
                responseId: itemResponse.id,
                responseLabel: itemResponse.label,
                responseValue: itemResponse.value,
              };
            }),
          })),
        })
      ),

      predictionSummaries: surveyResponse
        .predictScriptureEngagement()
        .map((prediction) => {
          const practice = prediction.practice;
          return {
            practiceSummary: {
              id: practice.id,
              title: practice.title,
              description: practice.description,
            },
            predictionDetails: prediction.details,
            predict: prediction.predict,
          };
        }),
    };
  }

  /**
   * Dump the contents of a survey response for use in debugging/verification.
   */
  public dump(surveyResponse: SurveyResponse): void {
    console.log("RESPONSE", surveyResponse.id);

    function tab(n: number, message: string): string {
      return "|  ".repeat(n) + message;
    }

    for (const dim of surveyResponse.survey.surveyDimensions) {
      console.log(`DIM (${dim.id}) ${dim.title}`);
      console.log("CHART", dim.chartData());

      for (const index of dim.surveyIndices) {
        console.log(
          tab(
            1,
            `IDX (${index.id}-${index.abbreviation}) ${index.title} 
                          ${
                            index.useForPredictions
                              ? "USE TO PREDICT"
                              : "DON'T USE TO PREDICT"
                          }
             => ${index.meanResponse()}`
          )
        );

        for (const pte of index.predictionTableEntries) {
          console.log(tab(2, `PTE (${pte.id}) ${pte.practice.title}`));
        }

        const showResponses = false;
        if (showResponses) {
          for (const item of index.surveyItems) {
            console.log(
              tab(
                2,
                `ITEM (${item.id}-${item.qualtricsId}) ${item.qualtricsText}`
              )
            );

            for (const response of item.surveyItemResponses) {
              console.log(
                tab(
                  3,
                  `RESP (${response.id}) ${response.label}, ${response.value}`
                )
              );
            }
          }
        }
      }
    }

    console.log("SCRIPTURE ENGAGEMENT");
    for (const prediction of surveyResponse.predictScriptureEngagement()) {
      console.log(
        tab(
          1,
          `${prediction.practice.title} - ${
            prediction.predict ? "PREDICT" : "DON'T PREDICT"
          }`
        )
      );

      for (const detail of prediction.details) {
        console.log(tab(2, `${detail.abbreviation} - ${detail.meanResponse}`));
      }
    }
  }
}
