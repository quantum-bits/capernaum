import { Entity } from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "../../shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType({ description: "Scripture engagement practice" })
export class ScriptureEngagementPractice extends AbstractEntity {
  @FieldColumn("Practice title")
  title: string;

  @FieldColumn("Description of this practice", { type: "text" })
  description: string;

  @FieldColumn("URL for more information on practice")
  moreInfoUrl: string;

  @FieldColumn("Sequence number", () => Int)
  sequence: number;
}

@InputType()
export class ScriptureEngagementPracticeCreateInput {
  @Field() title: string;
  @Field() description: string;
  @Field() moreInfoUrl: string;
  @Field(() => Int) sequence: number;
}

@InputType()
export class ScriptureEngagementPracticeUpdateInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
  @Field({ nullable: true }) moreInfoUrl: string;
  @Field(() => Int, { nullable: true }) sequence?: number;
}
