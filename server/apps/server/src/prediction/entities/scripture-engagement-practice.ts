import { Entity, ManyToMany } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "../../shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";
import { SurveyIndex } from "@server/src/survey/entities";

@Entity()
@ObjectType({ description: "Scripture engagement practice" })
export class ScriptureEngagementPractice extends AbstractEntity {
  @FieldColumn("Practice title")
  title: string;

  @FieldColumn("Description of this practice", { type: "text" })
  description: string;

  @FieldColumn("URL for more information on practice")
  moreInfoUrl: string;

  @FieldColumn("Include this SEP in prediction counts?", { default: true })
  forPredictionCounts: boolean;

  @Field(() => [SurveyIndex], { description: "Survey indices for this SEP" })
  @ManyToMany(() => SurveyIndex, (sidx) => sidx.scriptureEngagementPractices, {
    nullable: true,
  })
  surveyIndices: SurveyIndex[];
}

@InputType()
export class ScriptureEngagementPracticeCreateInput
  implements Partial<ScriptureEngagementPractice>
{
  @Field() title: string;
  @Field() description: string;
  @Field() moreInfoUrl: string;
  @Field() forPredictionCounts: boolean;
}

@InputType()
export class ScriptureEngagementPracticeUpdateInput
  implements Partial<ScriptureEngagementPractice>
{
  @Field(() => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) moreInfoUrl: string;
  @Field({ nullable: true }) forPredictionCounts: boolean;
}
