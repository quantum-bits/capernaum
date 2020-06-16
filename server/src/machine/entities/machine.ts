import { AbstractEntity } from "../../shared/abstract-entity";

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

@Entity()
@ObjectType()
export class Machine extends AbstractEntity {
  @Column() @Field() name: string;
  @Column() @Field() hostName: string;
  @Column() @Field() active: boolean;
}

@InputType()
export class MachineCreateInput {
  @Field() name: string;
  @Field() hostName: string;
  @Field() active: boolean;
}
