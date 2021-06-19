import { AbstractEntity } from "../../shared/abstract-entity";
import { CreateDateColumn, Entity } from "typeorm";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class Event extends AbstractEntity {
  @Field()
  @CreateDateColumn()
  date: string;

  @FieldColumn("event type")
  type: string;

  @FieldColumn("event details")
  details: string;
}

@InputType()
export class EventCreateInput {
  @Field() type: string;
  @Field() details: string;
}
