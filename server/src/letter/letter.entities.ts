import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

/**
 * Letter
 */

@Entity()
@ObjectType()
export class Letter {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

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
}

@InputType()
export class LetterUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) name: string;
  @Field({ nullable: true }) isFrozen: boolean;
}

/**
 * LetterElementType
 */

@Entity()
@ObjectType()
export class LetterElementType {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Field()
  @Column()
  key: string;

  @Field()
  @Column()
  description: string;
}
