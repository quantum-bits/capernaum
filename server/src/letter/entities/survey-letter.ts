import { Field, ObjectType } from "type-graphql";
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
