import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn
} from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { LetterElement } from "./letter-element";

@Entity()
@ObjectType()
export class Letter extends AbstractEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;

  @Field()
  @Column()
  isFrozen: boolean = false;

  @OneToMany(type => LetterElement, letterElement => letterElement.letter)
  @Field(type => [LetterElement])
  elements: LetterElement[];
}

@InputType()
export class LetterUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) name: string;
  @Field({ nullable: true }) isFrozen: boolean;
}
