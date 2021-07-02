import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToOne } from "typeorm";
import { Survey } from "@server/src/survey/entities/survey";
import { Letter, LetterType } from "@server/src/letter/entities";

@Entity()
@ObjectType({ description: "Associate survey, letter, and letter type" })
export class SurveyLetter {
  @Field(() => Survey)
  @ManyToOne(() => Survey, { primary: true })
  survey: Survey;

  @Field(() => Letter)
  @ManyToOne(() => Letter, { primary: true })
  letter: Letter;

  @Field(() => LetterType)
  @ManyToOne(() => LetterType, { primary: true })
  letterType: LetterType;
}

@InputType()
export class SurveyLetterCreateInput {
  @Field(() => Int) surveyId: number;
  @Field(() => Int) letterId: number;
  @Field(() => Int) letterTypeId: number;
}
