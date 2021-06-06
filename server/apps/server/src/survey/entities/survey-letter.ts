import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Survey } from ".";
import { Letter, LetterType } from "@server/src/letter/entities";

@Entity()
@ObjectType()
export class SurveyLetter {
  @Field(() => Int) @PrimaryGeneratedColumn() id: number;

  @Field(() => Survey)
  @ManyToOne(() => Survey)
  survey: Survey;
  @Column("integer") surveyId: number;

  @Field(() => Letter)
  @ManyToOne(() => Letter)
  letter: Letter;
  @Column("integer") letterId: number;

  @Field(() => LetterType)
  @ManyToOne(() => LetterType)
  letterType: LetterType;
  @Column("integer") letterTypeId: number;
}

@InputType()
export class SurveyLetterCreateInput {}

@InputType()
export class SurveyLetterUpdateInput {
  @Field(() => Int) id: number;
}
