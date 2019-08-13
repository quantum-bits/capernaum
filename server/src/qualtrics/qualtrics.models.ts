import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class QualtricsSurveyMetadata {
  @Field() id: string = "";
  @Field() name: string = "";
  @Field() ownerId: string = "";
  @Field() lastModified: string = "";
  @Field() creationDate: string = "";
  @Field() isActive: boolean = false;
}
