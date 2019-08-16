import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SurveyIndex } from "./survey-index";
import { Survey } from "./survey";

@Entity()
@ObjectType()
export class SurveyItem {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(type => Survey, survey => survey.surveyItems)
  survey: Survey;

  @ManyToOne(type => SurveyIndex, surveyIndex => surveyIndex.surveyItems)
  surveyIndex: SurveyIndex;

  @Column("integer")
  @Field(type => Int)
  sequence: number;

  @Column()
  @Field()
  qualtricsId: string;

  @Column()
  @Field()
  qualtricsText: string;
}
