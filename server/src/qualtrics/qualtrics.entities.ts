import { Field, ObjectType } from "type-graphql";
import { Survey } from "../survey/entities";

@ObjectType()
export class QualtricsSurveyListItem {
  @Field() qualtricsId: string;
  @Field() qualtricsName: string;
  @Field() qualtricsOwnerId: string;
  @Field() qualtricsModDate: string;
  @Field() qualtricsCreationDate: string;
  @Field() qualtricsIsActive: boolean;
  @Field(type => [Survey]) importedAs: Survey[];
}
