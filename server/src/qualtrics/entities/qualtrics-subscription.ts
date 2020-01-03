import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class QualtricsSubscription {
  @Field() id: string;
  @Field() scope: string;
  @Field() topics: string;
  @Field() publicationUrl: string;
  @Field() encrypted: boolean;
  @Field(type => Int) successfulCalls: number;
}
