import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./survey";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyItemResponse } from "./survey-item-response";
import { SurveyIndex } from "./survey-index";
import { ScriptureEngagementPractice } from "../../prediction/entities";
import { Prediction, PredictionDetails } from "../survey.types";
import { ResponseSummary } from "./survey-response-summary";
import debug from "debug";

const surveyDebug = debug("survey");

class ScriptureEngagementPracticePrediction {
  private surveyIndexMap: Map<number, SurveyIndex> = new Map();

  constructor(
    private responseId: number,
    private scriptureEngagementPractice: ScriptureEngagementPractice
  ) {}

  public maybeAddSurveyIndex(surveyIndex: SurveyIndex) {
    if (!this.surveyIndexMap.has(surveyIndex.id)) {
      this.surveyIndexMap.set(surveyIndex.id, surveyIndex);
    }
  }

  public getPrediction(): Prediction {
    const threshold = parseFloat(process.env.SEP_PREDICTION_THRESHOLD);
    const results: PredictionDetails[] = [];

    for (const surveyIndex of this.surveyIndexMap.values()) {
      results.push({
        title: surveyIndex.title,
        abbreviation: surveyIndex.abbreviation,
        meanResponse: surveyIndex.meanResponse(),
      });
    }

    return {
      practice: this.scriptureEngagementPractice,
      details: results,
      predict: results.every((result) => result.meanResponse > threshold),
    };
  }
}

@Entity()
@ObjectType({ description: "One user's response to a survey" })
export class SurveyResponse extends AbstractEntity {
  @Column("int") surveyId;
  @ManyToOne((type) => Survey, (survey) => survey.surveyItems)
  @Field((type) => Survey)
  survey: Survey;

  @OneToMany(
    (type) => SurveyItemResponse,
    (surveyItemResponse) => surveyItemResponse.surveyResponse
  )
  @Field((type) => [SurveyItemResponse])
  surveyItemResponses: SurveyItemResponse[];

  @Column() @Field() email: string;
  @Column() @Field() groupCode: string;
  @Column() @Field() qualtricsResponseId: string;
  @Column() @Field() startDate: string;
  @Column() @Field() endDate: string;
  @Column() @Field() recordedDate: string;
  @Column("int") @Field((type) => Int) status: number;
  @Column("int") @Field((type) => Int) progress: number;
  @Column("int") @Field((type) => Int) duration: number;
  @Column("int") @Field((type) => Int) finished: number;
  @Column() @Field() ipAddress: string;
  @Column() @Field() latitude: string;
  @Column() @Field() longitude: string;

  public summarize(): ResponseSummary {
    return {
      id: this.id,
      qualtricsResponseId: this.qualtricsResponseId,
      email: this.email,
      date: this.endDate,
      surveySummary: {
        id: this.survey.id,
        title: this.survey.qualtricsName,
        qualtricsId: this.survey.qualtricsId,
        qualtricsName: this.survey.qualtricsName,
      },
      dimensionSummaries: this.survey.surveyDimensions.map((dimension) => ({
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
      })),
      predictionSummaries: this.predictScriptureEngagement().map(
        (prediction) => {
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
        }
      ),
    };
  }

  public findDimensionById(dimensionId: number) {
    return this.survey.surveyDimensions.find(
      (dimension) => dimension.id === dimensionId
    );
  }

  public predictScriptureEngagement() {
    const predictionMap: Map<
      number, // Practice ID
      ScriptureEngagementPracticePrediction
    > = new Map();

    for (const dimension of this.survey.surveyDimensions) {
      for (const surveyIndex of dimension.surveyIndices) {
        if (surveyIndex.useForPredictions) {
          for (const predictionTableEntry of surveyIndex.predictionTableEntries) {
            if (!predictionMap.has(predictionTableEntry.practiceId)) {
              predictionMap.set(
                predictionTableEntry.practiceId,
                new ScriptureEngagementPracticePrediction(
                  this.id,
                  predictionTableEntry.practice
                )
              );
            }
            const scriptureEngagementPracticePrediction = predictionMap.get(
              predictionTableEntry.practiceId
            );
            scriptureEngagementPracticePrediction.maybeAddSurveyIndex(
              surveyIndex
            );
          }
        }
      }
    }

    const predictions: Prediction[] = [];
    for (const sepPrediction of predictionMap.values()) {
      predictions.push(sepPrediction.getPrediction());
    }
    surveyDebug("predictScriptureEngagement - %O", predictions);
    return predictions;
  }

  private static tab(n: number, msge: string) {
    return "|  ".repeat(n) + msge;
  }

  public dump() {
    console.log("RESPONSE", this.id);

    for (const dim of this.survey.surveyDimensions) {
      console.log(`DIM (${dim.id}) ${dim.title}`);
      console.log("CHART", dim.chartData());

      for (const index of dim.surveyIndices) {
        console.log(
          SurveyResponse.tab(
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
          console.log(
            SurveyResponse.tab(2, `PTE (${pte.id}) ${pte.practice.title}`)
          );
        }

        if (false) {
          for (const item of index.surveyItems) {
            console.log(
              SurveyResponse.tab(
                2,
                `ITEM (${item.id}-${item.qualtricsId}) ${item.qualtricsText}`
              )
            );

            for (const response of item.surveyItemResponses) {
              console.log(
                SurveyResponse.tab(
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
    for (const prediction of this.predictScriptureEngagement()) {
      console.log(
        SurveyResponse.tab(
          1,
          `${prediction.practice.title} - ${
            prediction.predict ? "PREDICT" : "DON'T PREDICT"
          }`
        )
      );

      for (const detail of prediction.details) {
        console.log(
          SurveyResponse.tab(
            2,
            `${detail.abbreviation} - ${detail.meanResponse}`
          )
        );
      }
    }
  }
}
