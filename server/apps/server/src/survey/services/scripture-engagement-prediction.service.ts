import { Survey, SurveyIndex } from "@server/src/survey/entities";
import { ScriptureEngagementPractice } from "@server/src/prediction/entities";
import { Prediction, PredictionDetails } from "@server/src/survey/survey.types";
import { getDebugger } from "@helpers/debug-factory";
import { Injectable } from "@nestjs/common";
import { mean } from "lodash";

const debug = getDebugger("predict");

/**
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

  // THESE GUYS ARE FROM  SURVEY-INDEX
  surveyItemResponses(surveyIndex: SurveyIndex) {
    return surveyIndex.surveyItems.map((surveyItem) =>
      surveyItem.surveyItemResponse()
    );
  }

  /**
   * Calculate the mean of the values from all responses to this survey item.
   */
  public meanResponse(surveyIndex: SurveyIndex) {
    return mean(
      this.surveyItemResponses(surveyIndex).map(
        (surveyItemResponse) => surveyItemResponse.value
      )
    );
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
        meanResponse: this.meanResponse(surveyIndex),
      });
    }

    return {
      practice: this.scriptureEngagementPractice,
      details: results,
      predict: results.every((result) => result.meanResponse > threshold),
    };
  }
}

@Injectable()
export class ScriptureEngagementPredictionService {
  predictScriptureEngagement(survey: Survey): Prediction[] {
    const predictionMap: Map<
      number, // Practice ID
      ScriptureEngagementPracticePrediction
    > = new Map();

    for (const surveyDimension of survey.surveyDimensions) {
      for (const surveyIndex of surveyDimension.surveyIndices) {
        if (!surveyIndex.useForPredictions) {
          continue;
        }

        for (const predictionTableEntry of surveyIndex.predictionTableEntries) {
          if (!predictionMap.has(predictionTableEntry.practiceId)) {
            predictionMap.set(
              predictionTableEntry.practiceId,
              new ScriptureEngagementPracticePrediction(
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

    const predictions: Prediction[] = [];
    for (const sepPrediction of predictionMap.values()) {
      predictions.push(sepPrediction.getPrediction());
    }
    debug("predictScriptureEngagement - %O", predictions);
    return predictions;
  }
}
