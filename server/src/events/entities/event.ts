import { AbstractEntity } from "../../shared/abstract-entity";
import { Column, CreateDateColumn, Entity } from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Event extends AbstractEntity {
  @CreateDateColumn() @Field() date: string;
  @Column() @Field() type: string;
  @Column() @Field() details: string;
}

@InputType()
export class EventCreateInput {
  @Column() @Field() type: string;
  @Column() @Field() details: string;
}
