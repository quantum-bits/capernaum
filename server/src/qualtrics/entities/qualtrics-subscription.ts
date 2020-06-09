import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { SubscriptionType } from "../qualtrics.types";

@ObjectType()
export class QualtricsSubscription {
  @Field() id: string;
  @Field() scope: string;
  @Field() topics: string;
  @Field() publicationUrl: string;
  @Field() encrypted: boolean;
  @Field(type => Int) successfulCalls: number;
}

@InputType()
export class QualtricsSubscriptionCreateInput {
  @Field() hostName: string;
  @Field(type => String) subscriptionType: SubscriptionType;
  @Field({ nullable: true }) surveyId?: string;
}
