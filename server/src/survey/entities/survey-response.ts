import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./survey";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyItemResponse } from "./survey-item-response";
import { SurveyIndex } from "./survey-index";
import { ScriptureEngagementPractice } from "../../prediction/entities";
import { Prediction, PredictionDetails } from "../survey.types";

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
        meanResponse: surveyIndex.meanResponse(this.responseId)
      });
    }

    return {
      practice: this.scriptureEngagementPractice,
      details: results,
      predict: results.every(result => result.meanResponse > threshold)
    };
  }
}

@Entity()
@ObjectType({ description: "One user's response to a survey" })
export class SurveyResponse extends AbstractEntity {
  @Column("int") surveyId;
  @ManyToOne(type => Survey, survey => survey.surveyItems)
  @Field(type => Survey)
  survey: Survey;

  @OneToMany(
    type => SurveyItemResponse,
    surveyItemResponse => surveyItemResponse.surveyResponse
  )
  @Field(type => [SurveyItemResponse])
  surveyItemResponses: SurveyItemResponse[];

  @Column() @Field() email: string;
  @Column() @Field() groupCode: string;
  @Column() @Field() qualtricsResponseId: string;
  @Column() @Field() startDate: string;
  @Column() @Field() endDate: string;
  @Column() @Field() recordedDate: string;
  @Column("int") @Field(type => Int) status: number;
  @Column("int") @Field(type => Int) progress: number;
  @Column("int") @Field(type => Int) duration: number;
  @Column("int") @Field(type => Int) finished: number;
  @Column() @Field() ipAddress: string;
  @Column() @Field() latitude: string;
  @Column() @Field() longitude: string;

  public predictScriptureEngagement() {
    const predictionMap: Map<
      number, // Practice ID
      ScriptureEngagementPracticePrediction
    > = new Map();

    for (const dimension of this.survey.surveyDimensions) {
      if (dimension.useForPredictions) {
        for (const surveyIndex of dimension.surveyIndices) {
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
    return predictions;
  }

  private tab(n: number, msge: string) {
    return "|  ".repeat(n) + msge;
  }

  public dump() {
    for (let dim of this.survey.surveyDimensions) {
      console.log(
        `DIM (${dim.id}) ${dim.title} ${
          dim.useForPredictions ? "PREDICT" : "DON'T PREDICT"
        }`
      );
      console.log("CHART CHART", dim.chartData(this.id));

      for (let index of dim.surveyIndices) {
        console.log(
          this.tab(
            1,
            `IDX (${index.id}-${index.abbreviation}), ${
              index.title
            } => ${index.meanResponse(this.id)}`
          )
        );

        for (let pte of index.predictionTableEntries) {
          console.log(this.tab(2, `PTE (${pte.id}) ${pte.practice.title}`));
        }

        if (false) {
          for (let item of index.surveyItems) {
            console.log(
              this.tab(
                2,
                `ITEM (${item.id}-${item.qualtricsId}) ${item.qualtricsText}`
              )
            );

            for (let response of item.surveyItemResponses) {
              console.log(
                this.tab(
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
    for (let prediction of this.predictScriptureEngagement()) {
      console.log(
        this.tab(
          1,
          `${prediction.practice.title} - ${
            prediction.predict ? "PREDICT" : "DON'T PREDICT"
          }`
        )
      );

      for (let detail of prediction.details) {
        console.log(
          this.tab(2, `${detail.abbreviation} - ${detail.meanResponse}`)
        );
      }
    }
  }
}
