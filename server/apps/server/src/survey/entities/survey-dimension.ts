import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./survey";
import { SurveyIndex } from "./survey-index";
import { AbstractEntity } from "../../shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType({
  description: "Top-level grouping of questions in Capernaum; contains indices",
})
export class SurveyDimension extends AbstractEntity {
  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.surveyDimensions)
  survey: Survey;

  @Field(() => [SurveyIndex])
  @OneToMany(() => SurveyIndex, (index) => index.surveyDimension)
  surveyIndices: SurveyIndex[];

  @FieldColumn("Title of this dimension (e.g., 'Focus on Prayer')")
  title: string;

  @FieldColumn("Sequence number", () => Int)
  sequence: number;
}

@InputType({
  description:
    "Data to create a new dimension. Does not embed indices. Add them with createSurveyIndex.",
})
export class SurveyDimensionCreateInput implements Partial<SurveyDimension> {
  @Field(() => Int) surveyId: number;
  @Field() title: string;
  @Field(() => Int) sequence: number;
}

@InputType()
export class SurveyDimensionUpdateInput implements Partial<SurveyDimension> {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field(() => Int, { nullable: true }) sequence?: number;
}

@ObjectType()
export class SurveyDimensionDeleteOutput {
  @Field(() => Int, { description: "ID of deleted dimension" })
  deletedDimensionId: number;

  @Field(() => [Int], { description: "IDs of all deleted indices" })
  deletedIndexIds: number[];

  @Field(() => [Int], {
    description: "IDs of all items no longer associated with any deleted index",
  })
  deletedItemIds: number[];
}
