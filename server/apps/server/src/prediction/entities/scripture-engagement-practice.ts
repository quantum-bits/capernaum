import { Column, Entity } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "../../shared/abstract-entity";

@Entity()
@ObjectType({ description: "Scripture engagement practice" })
export class ScriptureEngagementPractice extends AbstractEntity {
  @Column() @Field() title: string;
  @Column("text") @Field() description: string;
  @Column() @Field() moreInfoUrl: string;
  @Column() @Field((type) => Int) sequence: number;
}

@InputType()
export class ScriptureEngagementPracticeCreateInput {
  @Field() title: string;
  @Field() description: string;
  @Field() moreInfoUrl: string;
  @Field((type) => Int) sequence: number;
}

@InputType()
export class ScriptureEngagementPracticeUpdateInput {
  @Field((type) => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) moreInfoUrl: string;
  @Field((type) => Int, { nullable: true }) sequence?: number;
}
