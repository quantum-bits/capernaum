import { AbstractEntity } from "../../shared/abstract-entity";

import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@Entity()
@ObjectType()
export class Machine extends AbstractEntity {
  @Column() @Field() name: string;
  @Column() @Field() hostname: string;
  @Column() @Field() active: boolean;
}

@InputType()
export class MachineCreateInput {
  @Field() name: string;
  @Field() hostname: string;
  @Field() active: boolean;
}
