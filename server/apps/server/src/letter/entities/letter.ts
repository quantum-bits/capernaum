import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElement } from "./letter-element";
import { PredictionTableEntry } from "../../prediction/entities";
import { Survey } from "../../survey/entities";
import { DEFAULT_QUILL_DELTA } from "../letter.types";
import { LetterType } from "./letter-type";

@Entity()
@ObjectType()
export class Letter extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column("text")
  @Field()
  description: string;

  @Field()
  @Column({ type: "text", default: DEFAULT_QUILL_DELTA })
  emailMessage: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;

  @Field({ defaultValue: false })
  @Column()
  isFrozen: false;

  @Column("int") surveyId?: number;
  @ManyToOne((type) => Survey, (survey) => survey.letters)
  @Field((type) => Survey)
  survey?: Survey;

  @Column("int") letterTypeId: number;
  @ManyToOne((type) => LetterType)
  @Field((type) => LetterType)
  letterType: LetterType;

  @OneToMany((type) => LetterElement, (letterElement) => letterElement.letter)
  @Field((type) => [LetterElement])
  letterElements: LetterElement[];

  @OneToMany((type) => PredictionTableEntry, (entry) => entry.letter)
  @Field((type) => [PredictionTableEntry])
  tableEntries: PredictionTableEntry[];
}

@InputType()
export class LetterCreateInput {
  @Field() title: string;
  @Field() description: string;
  @Field() emailMessage: string;
  @Field({ nullable: true, defaultValue: false }) isFrozen?: boolean;
  @Field((type) => Int) surveyId: number;
}

@InputType()
export class LetterUpdateInput {
  @Field((type) => Int) id: number;
  @Field({ nullable: true }) title: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) emailMessage: string;
  @Field({ nullable: true }) isFrozen: boolean;
  @Field((type) => Int, { nullable: true }) surveyId: number;
}
