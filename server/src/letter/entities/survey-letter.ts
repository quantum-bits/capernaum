import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Survey } from "../../survey/entities";
import { PredictionTable } from "../../prediction/entities";
import { Letter } from "./letter";

@Entity()
@ObjectType()
export class SurveyLetter extends AbstractEntity {
  @Column("int") surveyId: number;
  @ManyToOne(type => Survey)
  @Field(type => Survey)
  survey: Survey;

  @Column("int") predictionTableId: number;
  @ManyToOne(type => PredictionTable)
  @Field(type => PredictionTable)
  predictionTable: PredictionTable;

  @Column("int") letterId: number;
  @ManyToOne(type => Letter)
  @Field(type => Letter)
  letter: Letter;

  @Column()
  @Field()
  isActive: boolean;

  @Column()
  @Field()
  isFrozen: boolean;
}

@InputType()
export class SurveyLetterCreateInput {
  @Field() surveyId: number;
  @Field() predictionTableId: number;
  @Field() letterId: number;
  @Field({ defaultValue: false }) isActive: boolean;
  @Field({ defaultValue: false }) isFrozen: boolean;
}

@InputType()
export class SurveyLetterUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) surveyId?: number;
  @Field({ nullable: true }) predictionTableId?: number;
  @Field({ nullable: true }) letterId?: number;
  @Field({ nullable: true }) isActive?: boolean;
  @Field({ nullable: true }) isFrozen?: boolean;
}
