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
import { SurveyDimension } from "@server/src/survey/entities/survey-dimension";
import { getDebugger } from "@helpers/debug-factory";

const surveyDebug = getDebugger("survey");

/**
 * Encapsulate the prediction for a single SE practice.
 * We predict a practice if _every_ survey index associated with that practice
 * has a mean value that exceeds a configurable threshold.
 */
class ScriptureEngagementPracticePrediction {
  /**
   * Map of survey index by its ID.
   * @private
   */
  private surveyIndexMap: Map<number, SurveyIndex> = new Map();

  constructor(
    // private responseId: number,
    private scriptureEngagementPractice: ScriptureEngagementPractice
  ) {}

  /**
   * Add `surveyIndex` to the map if it's not already there.
   * TODO: Is this necessary?
   * A survey index appears in only one survey dimension
   * and can only predict a single SE practice.
   * @param surveyIndex
   */
  public maybeAddSurveyIndex(surveyIndex: SurveyIndex) {
    if (!this.surveyIndexMap.has(surveyIndex.id)) {
      this.surveyIndexMap.set(surveyIndex.id, surveyIndex);
    }
  }

  /**
   * Get the prediction for this practice.
   */
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

  /**
   * Summarize a survey response for use in debugging/validation.
   */
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

  public findDimensionById(dimensionId: number): SurveyDimension {
    return this.survey.surveyDimensions.find(
      (dimension) => dimension.id === dimensionId
    );
  }

  /**
   * Predict scripture engagement based on this survey result.
   *
   * @returns Array of `Prediction` objects.
   */
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
                  // this.id,
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

  /**
   * Dump the contents of a survey response for use in debugging/verification.
   */
  public dump(): void {
    console.log("RESPONSE", this.id);

    function tab(n: number, message: string): string {
      return "|  ".repeat(n) + message;
    }

    for (const dim of this.survey.surveyDimensions) {
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
    for (const prediction of this.predictScriptureEngagement()) {
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
