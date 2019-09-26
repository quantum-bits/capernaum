import { Column, Entity, OneToMany } from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { PredictionTableEntry } from "./prediction-table-entry";
import { AbstractEntity } from "../../shared/abstract-entity";

@Entity()
@ObjectType({ description: "Scripture engagement predictions for one survey" })
export class PredictionTable extends AbstractEntity {
  @OneToMany(type => PredictionTableEntry, entry => entry.table)
  @Field(type => [PredictionTableEntry])
  entries: PredictionTableEntry[];

  @Column() @Field() title: string;
  @Column("text") @Field() description: string;
}

@InputType()
export class PredictionTableCreateInput {
  @Field() title: string;
  @Field() description: string;
}

@InputType()
export class PredictionTableUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) description?: string;
}
