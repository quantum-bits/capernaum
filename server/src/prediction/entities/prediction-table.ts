import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { PredictionTableEntry } from "./prediction-table-entry";

@Entity()
@ObjectType({ description: "Scripture engagement predictions for one survey" })
export class PredictionTable {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

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
