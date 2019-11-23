import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./survey";
import { SurveyIndex } from "./survey-index";
import { AbstractEntity } from "../../shared/abstract-entity";
import { ChartData, ChartEntry } from "../survey.types";

@Entity()
@ObjectType({
  description: "Top-level grouping of questions in Capernaum; contains indices"
})
export class SurveyDimension extends AbstractEntity {
  @ManyToOne(type => Survey, survey => survey.surveyDimensions)
  @Field(type => Survey, { nullable: true })
  survey: Survey;
  @Column("integer")
  surveyId: number;

  @OneToMany(type => SurveyIndex, index => index.surveyDimension)
  @Field(type => [SurveyIndex])
  surveyIndices: SurveyIndex[];

  @Column()
  @Field({ description: "Title of this dimension (e.g., 'Focus on Prayer')" })
  title: string;

  @Column({ default: true })
  @Field({
    description: "Use this dimension in prediction tables?"
  })
  useForPredictions: boolean;

  @Column("int")
  @Field(type => Int, {
    description: "Sequence number; dimension are displayed in this order."
  })
  sequence: number;

  public chartData(responseId: number): ChartData {
    const chartEntries = this.surveyIndices.map(surveyIndex => {
      return {
        title: surveyIndex.title,
        value: surveyIndex.meanResponse(responseId)
      };
    });
    return {
      title: this.title,
      entries: chartEntries
    };
  }
}

@InputType({
  description:
    "Data to create a new dimension. Does not embed indices. Add them with createSurveyIndex."
})
export class SurveyDimensionCreateInput implements Partial<SurveyDimension> {
  @Field(type => Int) surveyId: number;
  @Field() title: string;
  @Field() useForPredictions: boolean;
  @Field(type => Int) sequence: number;
}

@InputType()
export class SurveyDimensionUpdateInput implements Partial<SurveyDimension> {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field({ nullable: true }) useForPredictions?: boolean;
  @Field(type => Int, { nullable: true }) sequence?: number;
}

@ObjectType()
export class SurveyDimensionDeleteOutput {
  @Field(type => Int, { description: "ID of deleted dimension" })
  deletedDimensionId: number;

  @Field(type => [Int], { description: "IDs of all deleted indices" })
  deletedIndexIds: number[];

  @Field(type => [Int], {
    description: "IDs of all items no longer associated with any deleted index"
  })
  deletedItemIds: number[];
}
