import { Field, ObjectType } from "@nestjs/graphql";
import { Survey } from "@server/src/survey/entities";

@ObjectType()
export class QualtricsSurveyListItem {
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
  @Field() qualtricsOwnerId: string;
  @Field() qualtricsModDate: string;
  @Field() qualtricsCreationDate: string;
  @Field() qualtricsIsActive: boolean;

  @Field(() => Survey, {
    description: "Associated Capernaum survey, if any",
    nullable: true,
  })
  capernaumSurvey?: Survey;
}
