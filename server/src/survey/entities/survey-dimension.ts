import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Survey } from "./survey";
import { SurveyIndex } from "./survey-index";

/**
 * SurveyDimension
 */

@Entity()
@ObjectType({
  description: "Top-level grouping of questions in Capernaum; contains indices"
})
export class SurveyDimension {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(type => Survey, survey => survey.surveyDimensions)
  survey: Survey;

  @OneToMany(type => SurveyIndex, index => index.surveyDimension)
  surveyIndices: SurveyIndex[];

  @Column()
  @Field({ description: "Abbreviation for this dimension (e.g., 'FOG')" })
  abbreviation: string;

  @Column()
  @Field({ description: "Title of this dimension (e.g., 'Focus on Prayer')" })
  title: string;

  @Column("int")
  @Field(type => Int, {
    description: "Sequence number; dimension are displayed in this order."
  })
  sequence: number;
}

@InputType({
  description:
    "Data to create a new dimension. Does not embed indices. Add them with createSurveyIndex."
})
export class SurveyDimensionCreateInput implements Partial<SurveyDimension> {
  @Field(type => Int) surveyId: number;
  @Field() abbreviation: string;
  @Field() title: string;
  @Field(type => Int) sequence: number;
}

@InputType()
export class SurveyDimensionUpdateInput implements Partial<SurveyDimension> {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) abbreviation?: string;
  @Field({ nullable: true }) title?: string;
  @Field(type => Int, { nullable: true }) sequence?: number;
}

@ObjectType()
export class SurveyDimensionDeleteOutput {
  @Field(type => Int, { description: "ID of deleted dimension" })
  deletedDimensionId: number;

  @Field(type => [Int], { description: "IDs of all deleted indices" })
  deletedIndexIds: number[];

  @Field(type => [Int], {
    description: "IDs of all items no longer associated with any deleted index"
  })
  deletedItemIds: number[];
}
