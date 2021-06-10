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
export class SurveyLetterCreateInput {
  @Field(() => Int) surveyId: number;
  @Field(() => Int) letterId: number;
  @Field(() => Int) letterTypeId: number;
}

@InputType()
export class SurveyLetterUpdateInput {
  @Field(() => Int) id: number;
  @Field(() => Int, { nullable: true }) surveyId?: number;
  @Field(() => Int, { nullable: true }) letterId?: number;
  @Field(() => Int, { nullable: true }) letterTypeId?: number;
}
