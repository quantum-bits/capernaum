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
  @ManyToOne(() => Survey, (survey) => survey.letters)
  @Field(() => Survey)
  survey?: Survey;

  @Column("int") letterTypeId: number;
  @ManyToOne(() => LetterType)
  @Field(() => LetterType)
  letterType: LetterType;

  @OneToMany(() => LetterElement, (letterElement) => letterElement.letter)
  @Field(() => [LetterElement])
  letterElements: LetterElement[];

  @OneToMany(() => PredictionTableEntry, (entry) => entry.letter)
  @Field(() => [PredictionTableEntry])
  tableEntries: PredictionTableEntry[];
}

@InputType()
export class LetterCreateInput {
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
