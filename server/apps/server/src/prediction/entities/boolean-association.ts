import { Field, InputType } from "@nestjs/graphql";

@InputType({
  description:
    "Communicate updates to survey index-to-SE practice relationships",
})
export class AssociationUpdateInput {
  @Field({ description: "Survey index ID" }) indexId: number;
  @Field({ description: "SE practice ID" }) practiceId: number;
  @Field({ description: "Whether index predicts practice" }) predict: boolean;
}
