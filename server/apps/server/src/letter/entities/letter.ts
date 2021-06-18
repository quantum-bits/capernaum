import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import {
  AfterLoad,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElement } from "./letter-element";
import { Survey } from "../../survey/entities";
import { DEFAULT_QUILL_DELTA } from "../letter.types";
import { LetterType } from "./letter-type";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class Letter extends AbstractEntity {
  @FieldColumn("Letter title")
  title: string;

  @FieldColumn("Description of letter")
  description: string;

  @FieldColumn("Email message to go out with letter", {
    type: "text",
    default: DEFAULT_QUILL_DELTA,
  })
  emailMessage: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;

  @FieldColumn("Is this letter frozen?", { default: false })
  isFrozen: boolean;

  @Field(() => Survey)
  @ManyToMany(() => Survey, (survey) => survey.letters)
  surveys: Survey[];

  @Field(() => LetterType)
  @ManyToOne(() => LetterType)
  letterType: LetterType;

  @Field(() => [LetterElement])
  @OneToMany(() => LetterElement, (elt) => elt.letter)
  letterElements: LetterElement[];

  @AfterLoad()
  sortLetterElements() {
    // If we loaded elements, sort 'em.
    if (this.letterElements) {
      this.letterElements = this.letterElements.sort(
        (a, b) => b.sequence - a.sequence
      );
    }
  }
}

@InputType()
export class LetterCreateInput implements Partial<Letter> {
  @Field() title: string;
  @Field() description: string;
  @Field() emailMessage: string;
  @Field({ nullable: true, defaultValue: false }) isFrozen?: boolean;
  @Field(() => Int) surveyId: number;
  @Field(() => Int) letterTypeId: number;
}

@InputType()
export class LetterUpdateInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) title: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) emailMessage: string;
  @Field({ nullable: true }) isFrozen: boolean;
  @Field(() => Int, { nullable: true }) surveyId: number;
  @Field(() => Int, { nullable: true }) letterTypeId: number;
}
