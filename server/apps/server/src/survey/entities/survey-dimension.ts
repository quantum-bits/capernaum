import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Entity, OneToMany } from "typeorm";
import { Survey } from "./survey";
import { SurveyIndex } from "./survey-index";
import { AbstractEntity } from "../../shared/abstract-entity";
import { ChartData } from "../survey.types";
import { FieldColumn, FieldManyToOne } from "@server/src/decorators";

@Entity()
@ObjectType({
  description: "Top-level grouping of questions in Capernaum; contains indices",
})
export class SurveyDimension extends AbstractEntity {
  // @ManyToOne(() => Survey, (survey) => survey.surveyDimensions)
  // @Field(() => Survey, { nullable: true })
  @FieldManyToOne(
    "Survey that owns this dimension",
    () => Survey,
    (survey) => survey.surveyDimensions,
    { nullable: true }
  )
  survey: Survey;

  @OneToMany(() => SurveyIndex, (index) => index.surveyDimension)
  @Field(() => [SurveyIndex])
  surveyIndices: SurveyIndex[];

  @FieldColumn("Title of this dimension (e.g., 'Focus on Prayer')")
  title: string;

  @FieldColumn("Sequence number", () => Int)
  sequence: number;

  /**
   * The bar chart in the response letter corresponds to a survey dimension.
   * Each bar represents a survey index within the survey dimension.
   * The value of each bar is the mean of all the survey items (questions) associated with the index.
   */
  public chartData(): ChartData {
    const chartEntries = this.surveyIndices.map((surveyIndex) => {
      return {
        title: surveyIndex.title,
        value: surveyIndex.meanResponse(),
      };
    });

    return new ChartData(this.title, chartEntries);
  }
}

@InputType({
  description:
    "Data to create a new dimension. Does not embed indices. Add them with createSurveyIndex.",
})
export class SurveyDimensionCreateInput implements Partial<SurveyDimension> {
  @Field(() => Int) surveyId: number;
  @Field() title: string;
  @Field(() => Int) sequence: number;
}

@InputType()
export class SurveyDimensionUpdateInput implements Partial<SurveyDimension> {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) title?: string;
  @Field(() => Int, { nullable: true }) sequence?: number;
}

@ObjectType()
export class SurveyDimensionDeleteOutput {
  @Field(() => Int, { description: "ID of deleted dimension" })
  deletedDimensionId: number;

  @Field(() => [Int], { description: "IDs of all deleted indices" })
  deletedIndexIds: number[];

  @Field(() => [Int], {
    description: "IDs of all items no longer associated with any deleted index",
  })
  deletedItemIds: number[];
}
