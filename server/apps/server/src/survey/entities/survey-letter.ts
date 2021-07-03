import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToOne, Unique } from "typeorm";
import { Survey } from "@server/src/survey/entities/survey";
import { Letter, LetterType } from "@server/src/letter/entities";
import { AbstractEntity } from "@server/src/shared/abstract-entity";

@Entity()
@Unique(["survey", "letter", "letterType"])
@ObjectType({ description: "Associate survey, letter, and letter type" })
export class SurveyLetter extends AbstractEntity {
  @Field(() => Survey, { description: "The survey" })
  @ManyToOne(() => Survey)
  survey: Survey;

  @Field(() => Letter, { description: "The letter" })
  @ManyToOne(() => Letter)
  letter: Letter;

  @Field(() => LetterType, { description: "The letter type" })
  @ManyToOne(() => LetterType)
  letterType: LetterType;
}

@InputType()
export class SurveyLetterCreateInput {
  @Field(() => Int) surveyId: number;
  @Field(() => Int) letterId: number;
  @Field(() => Int) letterTypeId: number;
}
