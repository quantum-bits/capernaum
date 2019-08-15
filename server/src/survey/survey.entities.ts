import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

/**
 * Survey
 */

@Entity()
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Field()
  @Column()
  qualtricsId: string;

  @Field()
  @Column()
  title: string;
}

@InputType()
export class SurveyCreateInput {
  @Field() qualtricsId: string;
  @Field() title: string;
}

@InputType()
export class SurveyUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) qualtricsId?: string;
  @Field({ nullable: true }) title?: string;
}

/**
 * SurveyDimension
 */

@Entity()
@ObjectType()
export class SurveyDimension {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Field()
  @Column()
  abbreviation: string;

  @Field()
  @Column()
  title: string;
}

@InputType()
export class SurveyDimensionCreateInput implements Partial<SurveyDimension> {
  @Field() abbreviation: string;
  @Field() title: string;
}
