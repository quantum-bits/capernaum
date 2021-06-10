import { AfterLoad, Column, Entity, OneToMany } from "typeorm";
import { LetterElement } from "@server/src/letter/entities";
import { PredictionTableEntry } from "@server/src/prediction/entities/prediction-table-entry";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { AbstractEntity } from "@server/src/shared/abstract-entity";
import { FieldColumn } from "@server/src/decorators";

@Entity()
@ObjectType()
export class PredictionTable extends AbstractEntity {
  @FieldColumn("Prediction table name")
  name: string;

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

  @AfterLoad()
  sortTableEntries() {
    this.predictionTableEntries = this.predictionTableEntries.sort(
      (a, b) => b.sequence - a.sequence
    );
  }
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
