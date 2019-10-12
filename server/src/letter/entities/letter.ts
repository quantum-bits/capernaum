import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn
} from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElement } from "./letter-element";
import { PredictionTableEntry } from "../../prediction/entities";
import { Survey } from "../../survey/entities";

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
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;

  @Field()
  @Column()
  isFrozen: boolean = false;

  @Column("int") surveyId: number;
  @ManyToOne(type => Survey)
  @Field(type => Survey)
  survey: Survey;

  @OneToMany(type => LetterElement, letterElement => letterElement.letter)
  @Field(type => [LetterElement])
  letterElements: LetterElement[];

  @OneToMany(type => PredictionTableEntry, entry => entry.letter)
  @Field(type => [PredictionTableEntry])
  tableEntries: PredictionTableEntry[];
}

@InputType()
export class LetterUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) title: string;
  @Field({ nullable: true }) description: string;
  @Field({ nullable: true }) isFrozen: boolean;
}
