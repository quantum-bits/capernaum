import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PredictionDetails } from "../survey.types";

@ObjectType()
export class ItemSummary {
  @Field(() => Int) id: number;
  @Field() qualtricsId: string;
  @Field() qualtricsText: string;
  @Field(() => Int) responseId: number;
  @Field() responseLabel: string;
  @Field() responseValue: number;
}

@ObjectType()
export class IndexSummary {
  @Field(() => Int) id: number;
  @Field() title: string;
  @Field() abbreviation: string;
  @Field() meanResponse: number;
  @Field(() => [ItemSummary]) itemSummaries: ItemSummary[];
}

@ObjectType()
export class DimensionSummary {
  @Field(() => Int) id: number;
  @Field() title: string;
  @Field(() => [IndexSummary])
  indexSummaries: IndexSummary[];
}

@ObjectType()
export class SurveySummary {
  @Field(() => Int) id: number;
  @Field() title: string;
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
}

@ObjectType()
export class PracticeSummary {
  @Field(() => Int) id: number;
  @Field() title: string;
  @Field() description: string;
}

@ObjectType()
export class PredictionSummary {
  @Field(() => PracticeSummary) practiceSummary: PracticeSummary;
  @Field(() => [PredictionDetails]) predictionDetails: PredictionDetails[];
  @Field() predict: boolean;
}

@ObjectType()
export class ResponseSummary {
  @Field(() => Int) id: number;
  @Field() qualtricsResponseId: string;
  @Field() email: string;
  @Field() date: string;
  @Field(() => SurveySummary) surveySummary: SurveySummary;
  @Field(() => [DimensionSummary]) dimensionSummaries: DimensionSummary[];
  @Field(() => [PredictionSummary])
  predictionSummaries: PredictionSummary[];
}
