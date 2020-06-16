import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn
} from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElement } from "./letter-element";
import { PredictionTableEntry } from "../../prediction/entities";
import { Survey } from "../../survey/entities";
import { DEFAULT_QUILL_DELTA } from "../letter.types";

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
  isFrozen: boolean = false;

  @OneToOne(
    type => Survey,
    survey => survey.letter
  )
  @JoinColumn()
  @Field(type => Survey, { nullable: true })
  survey?: Survey;

  @Column("int", { nullable: true })
  surveyId?: number;

  @OneToMany(
    type => LetterElement,
    letterElement => letterElement.letter
  )
  @Field(type => [LetterElement])
  letterElements: LetterElement[];

  @OneToMany(
    type => PredictionTableEntry,
    entry => entry.letter
  )
  @Field(type => [PredictionTableEntry])
  tableEntries: PredictionTableEntry[];
}

@InputType()
export class LetterCreateInput {
  @Field() title: string;
  @Field() description: string;
  @Field() emailMessage: string;
  @Field({ nullable: true, defaultValue: false }) isFrozen?: boolean;
  @Field(type => Int) surveyId: number;
}

@InputType()
export class LetterUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) title: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) emailMessage: string;
  @Field({ nullable: true }) isFrozen: boolean;
  @Field(type => Int, { nullable: true }) surveyId: number;
}
