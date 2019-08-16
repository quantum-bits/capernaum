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
@ObjectType()
export class SurveyDimension {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(type => Survey, survey => survey.surveyDimensions)
  survey: Survey;

  @OneToMany(type => SurveyIndex, index => index.surveyDimension)
  surveyIndices: SurveyIndex[];

  @Field()
  @Column()
  abbreviation: string;

  @Field()
  @Column()
  title: string;

  @Field(type => Int)
  @Column("int")
  sequence: number;
}

@InputType()
export class SurveyDimensionCreateInput implements Partial<SurveyDimension> {
  @Field() abbreviation: string;
  @Field() title: string;
}
