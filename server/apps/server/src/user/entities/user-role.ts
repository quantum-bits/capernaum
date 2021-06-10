import { AbstractEntity } from "../../shared/abstract-entity";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Entity } from "typeorm";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class UserRole extends AbstractEntity {
  @FieldColumn("Role name", { unique: true })
  name: string;

  @FieldColumn("Role description")
  description: string;
}

@InputType()
export class UserRoleCreateInput {
  @Field() name: string;
  @Field() description: string;
}
