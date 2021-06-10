import { Entity, ManyToOne } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Survey } from ".";
import { Letter, LetterType } from "@server/src/letter/entities";
import { AbstractEntity } from "@server/src/shared/abstract-entity";

@Entity()
@ObjectType()
export class SurveyLetter extends AbstractEntity {
  @Field(() => Survey)
  @ManyToOne(() => Survey)
  survey: Survey;

  @Field(() => Letter)
  @ManyToOne(() => Letter)
  letter: Letter;

  @Field(() => LetterType)
  @ManyToOne(() => LetterType)
  letterType: LetterType;
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
