import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, Int, ObjectType, InputType } from "type-graphql";
import { PredictionTableEntry } from "./prediction-table-entry";

@Entity()
@ObjectType({ description: "Scripture engagement practice" })
export class ScriptureEngagementPractice {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column() @Field() title: string;
  @Column("text") @Field() description: string;
  @Column() @Field(type => Int) sequence: number;
}

@InputType()
export class ScriptureEngagementPracticeCreateInput {
  @Field() title: string;
  @Field() description: string;
  @Field(type => Int) sequence: number;
}

@InputType()
export class ScriptureEngagementPracticeUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
  @Field(type => Int, { nullable: true }) sequence?: number;
}
