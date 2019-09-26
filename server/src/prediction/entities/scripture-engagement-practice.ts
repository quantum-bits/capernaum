import { Column, Entity } from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { AbstractEntity } from "../../shared/abstract-entity";

@Entity()
@ObjectType({ description: "Scripture engagement practice" })
export class ScriptureEngagementPractice extends AbstractEntity {
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
