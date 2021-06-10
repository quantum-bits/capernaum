import { AbstractEntity } from "../../shared/abstract-entity";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Entity } from "typeorm";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class Machine extends AbstractEntity {
  @FieldColumn("Machine name") name: string;
  @FieldColumn("Host name (e.g., FQDN)") hostName: string;
  @FieldColumn("Is this machine active?") active: boolean;
}

@InputType()
export class MachineCreateInput {
  @Field() name: string;
  @Field() hostName: string;
  @Field() active: boolean;
}
