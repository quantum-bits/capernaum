import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import {
  AfterLoad,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElement } from "./letter-element";
import { DEFAULT_QUILL_DELTA } from "../letter.types";
import { FieldColumn } from "@server/src/decorators";
import { SurveyLetter } from "@server/src/survey/entities";

@Entity()
@ObjectType()
export class Letter extends AbstractEntity {
  @FieldColumn("Letter title")
  title: string;

  @FieldColumn("Description of letter", { default: "Update description!" })
  description: string;

  @FieldColumn("Email message to go out with letter", {
    type: "text",
    default: DEFAULT_QUILL_DELTA,
  })
  emailMessage: string;

  @Field({ description: "Date created" })
  @CreateDateColumn()
  created: Date;

  @Field({ description: "Date last updated" })
  @UpdateDateColumn()
  updated: Date;

  @Field(() => [SurveyLetter], {
    description: "Survey letters for this letter",
  })
  @OneToMany(() => SurveyLetter, (surveyLetter) => surveyLetter.letter)
  surveyLetters: SurveyLetter[];

  @Field(() => [LetterElement], {
    description: "Elements that make up this letter",
  })
  @OneToMany(() => LetterElement, (elt) => elt.letter)
  letterElements: LetterElement[];

  @AfterLoad()
  sortLetterElements() {
    // If we loaded elements, sort 'em.
    if (this.letterElements) {
      this.letterElements = this.letterElements.sort(
        (a, b) => a.sequence - b.sequence
      );
    }
  }
}

@InputType()
export class LetterCreateInput implements Partial<Letter> {
  @Field() title: string;
  @Field() description: string;
  @Field() emailMessage: string;
  @Field(() => Int) letterTypeId: number;
}

@InputType()
export class LetterUpdateInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) title: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) emailMessage: string;
  @Field(() => Int, { nullable: true }) letterTypeId: number;
}
