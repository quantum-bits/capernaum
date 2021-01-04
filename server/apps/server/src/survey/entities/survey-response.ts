import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./survey";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyItemResponse } from "./survey-item-response";
import { SurveyIndex } from "./survey-index";
import { ScriptureEngagementPractice } from "../../prediction/entities";
import { Prediction, PredictionDetails } from "../survey.types";
import { ResponseSummary } from "./survey-response-summary";
import { Group } from "../../group/entities";
import debug from "debug";
import { SurveyDimension } from "@server/src/survey/entities/survey-dimension";

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
  @Column("int", { nullable: true }) groupId?: number;
  @ManyToOne(() => Group, (group) => group.surveyResponses)
  @Field(() => Group, {
    nullable: true,
    description: "Group for this response (if any)",
  })
  group: Group;

  @Column("int") surveyId: number;
  @ManyToOne(() => Survey, (survey) => survey.surveyItems)
  @Field(() => Survey, {
    description: "Survey for which this is a response",
  })
  survey: Survey;

  @OneToMany(
    () => SurveyItemResponse,
    (surveyItemResponse) => surveyItemResponse.surveyResponse
  )
  @Field(() => [SurveyItemResponse], {
    description: "Responses to individual items in the survey",
  })
  surveyItemResponses: SurveyItemResponse[];

  @Column()
  @Field({ description: "Respondent's email address" })
  email: string;

  @Column()
  @Field({ description: "Group code word" })
  codeWord: string;

  @Column()
  @Field()
  qualtricsResponseId: string;

  @Column()
  @Field({ description: "When survey was started" })
  startDate: string;

  @Column()
  @Field({ description: "When survey was completed" })
  endDate: string;

  @Column()
  @Field({ description: "When survey was recorded" })
  recordedDate: string;

  @Column("int")
  @Field(() => Int, { description: "Type of response" })
  status: number;

  @Column("int")
  @Field(() => Int, { description: "Percent complete" })
  progress: number;

  @Column("int")
  @Field(() => Int, { description: "Time to complete (seconds)" })
  duration: number;

  @Column("int")
  @Field(() => Int, {
    description: "1 = Survey complete and submitted, 0 = otherwise",
  })
  finished: number;

  @Column()
  @Field({ description: "Respondent's IP address" })
  ipAddress: string;

  @Column()
  @Field({ description: "Respondent's latitude" })
  latitude: string;

  @Column()
  @Field({ description: "Respondent's longitude" })
  longitude: string;

  summarize = (): ResponseSummary => ({
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
    predictionSummaries: this.predictScriptureEngagement().map((prediction) => {
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
  });

  findDimensionById = (dimensionId: number): SurveyDimension =>
    this.survey.surveyDimensions.find(
      (dimension) => dimension.id === dimensionId
    );

  public predictScriptureEngagement(): Prediction[] {
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

  static tab = (n: number, message: string): string =>
    "|  ".repeat(n) + message;

  public dump(): void {
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

        const showResponses = false;
        if (showResponses) {
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
