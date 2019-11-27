import { Field, Int, ObjectType } from "type-graphql";
import { PredictionDetails } from "../survey.types";

@ObjectType()
export class ItemSummary {
  @Field(type => Int) id: number;
  @Field() qualtricsId: string;
  @Field() qualtricsText: string;
  @Field(type => Int) responseId: number;
  @Field() responseLabel: string;
  @Field() responseValue: number;
}

@ObjectType()
export class IndexSummary {
  @Field(type => Int) id: number;
  @Field() title: string;
  @Field() abbreviation: string;
  @Field() meanResponse: number;
  @Field(type => [ItemSummary]) itemSummaries: ItemSummary[];
}

@ObjectType()
export class DimensionSummary {
  @Field(type => Int) id: number;
  @Field() title: string;
  @Field(type => [IndexSummary])
  indexSummaries: IndexSummary[];
}

@ObjectType()
export class SurveySummary {
  @Field(type => Int) id: number;
  @Field() title: string;
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
}

@ObjectType()
export class PracticeSummary {
  @Field(type => Int) id: number;
  @Field() title: string;
  @Field() description: string;
}

@ObjectType()
export class PredictionSummary {
  @Field(type => PracticeSummary) practiceSummary: PracticeSummary;
  @Field(type => PredictionDetails) predictionDetails: PredictionDetails[];
  @Field() predict: boolean;
}

@ObjectType()
export class ResponseSummary {
  @Field(type => Int) id: number;
  @Field() qualtricsResponseId: string;
  @Field() email: string;
  @Field() date: string;
  @Field(type => SurveySummary) surveySummary: SurveySummary;
  @Field(type => [DimensionSummary]) dimensionSummaries: DimensionSummary[];
  @Field(type => [PredictionSummary]) predictionSummaries: PredictionSummary[];
}
