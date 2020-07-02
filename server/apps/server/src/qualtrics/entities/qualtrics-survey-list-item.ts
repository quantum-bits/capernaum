import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class QualtricsSurveyListItem {
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
  @Field() qualtricsOwnerId: string;
  @Field() qualtricsModDate: string;
  @Field() qualtricsCreationDate: string;
  @Field() qualtricsIsActive: boolean;
  @Field() importedToCapernaum: boolean;
}
