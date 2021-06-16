import { ScriptureEngagementPractice } from "../prediction/entities";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { SurveyResponse } from "./entities";
import { ChartData } from "@server/src/writer/writer.types";

// Used to filter which survey items are retrieved for a survey.
export enum WhichItems {
  All,
  WithIndex,
  WithoutIndex,
}

@ObjectType()
export class PredictionDetails {
  @Field() surveyIndexTitle: string;
  @Field() surveyIndexAbbreviation: string;
  @Field(() => Float) meanResponse: number;
}

@ObjectType()
export class Prediction {
  @Field(() => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

  @Field(() => [PredictionDetails])
  details: PredictionDetails[];

  @Field({ description: "Should we predict this practice?" })
  predict: boolean;
}

@ObjectType()
export class DimensionDetails {
  @Field(() => Int) indexId: number;
  @Field() indexTitle: string;
  @Field(() => Float) meanSurveyIndex: number;
}

@ObjectType()
export class Dimension {
  @Field(() => Int) id: number;
  @Field() title: string;
  @Field(() => [DimensionDetails]) details: DimensionDetails[];

  asChartData(): ChartData {
    return {} as ChartData;
  }
}

@ObjectType()
export class QualtricsResponseImportStats {
  @Field(() => Int) importCount: number;
  @Field(() => Int) duplicateCount: number;
  @Field(() => [SurveyResponse]) surveyResponses: SurveyResponse[];

  constructor() {
    this.importCount = 0;
    this.duplicateCount = 0;
    this.surveyResponses = [];
  }
}

export interface QualtricsImportedResponse {
  isDuplicate: boolean;
  surveyResponse: SurveyResponse;
}
