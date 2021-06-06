import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LetterElement } from "@server/src/letter/entities";
import { PredictionTableEntry } from "@server/src/prediction/entities/prediction-table-entry";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class PredictionTable {
  @Field(() => Int) @PrimaryGeneratedColumn() id: number;

  @Field({ description: "Prediction table name" }) @Column() name: string;

  @Field(() => [PredictionTableEntry])
  @OneToMany(
    () => PredictionTableEntry,
    (predictionTableEntry) => predictionTableEntry.predictionTable
  )
  predictionTableEntries: PredictionTableEntry[];

  @Field(() => [LetterElement])
  @OneToMany(
    () => LetterElement,
    (letterElement) => letterElement.predictionTable
  )
  letterElements: LetterElement[];
}

@InputType()
export class PredictionTableCreateInput {
  @Field({ description: "Prediction table name" }) name: string;
}

@InputType()
export class PredictionTableUpdateInput {
  @Field(() => Int) id: number;

  @Field({ description: "Prediction table name", nullable: true })
  name?: string;
}
