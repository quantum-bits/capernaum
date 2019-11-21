import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Survey } from "./survey";
import { AbstractEntity } from "../../shared/abstract-entity";
import { SurveyItemResponse } from "./survey-item-response";

@Entity()
@ObjectType({ description: "One user's response to a survey" })
export class SurveyResponse extends AbstractEntity {
  @Column("int") surveyId;
  @ManyToOne(type => Survey, survey => survey.surveyItems)
  @Field(type => Survey)
  survey: Survey;

  @OneToMany(
    type => SurveyItemResponse,
    surveyItemResponse => surveyItemResponse.surveyResponse
  )
  @Field(type => [SurveyItemResponse])
  surveyItemResponses: SurveyItemResponse[];

  @Column() @Field() email: string;
  @Column() @Field() groupCode: string;
  @Column() @Field() qualtricsResponseId: string;
  @Column() @Field() startDate: string;
  @Column() @Field() endDate: string;
  @Column() @Field() recordedDate: string;
  @Column("int") @Field(type => Int) status: number;
  @Column("int") @Field(type => Int) progress: number;
  @Column("int") @Field(type => Int) duration: number;
  @Column("int") @Field(type => Int) finished: number;
  @Column() @Field() ipAddress: string;
  @Column() @Field() latitude: string;
  @Column() @Field() longitude: string;

  private tab(n: number, msge: string) {
    return "  ".repeat(n) + msge;
  }

  public dump() {
    for (let dim of this.survey.surveyDimensions) {
      console.log(`DIM (${dim.id}) ${dim.title}`);

      for (let index of dim.surveyIndices) {
        console.log(
          this.tab(
            1,
            `IDX (${index.id}), ${index.title} => ${index.meanResponse()}`
          )
        );

        for (let pte of index.predictionTableEntries) {
          console.log(this.tab(2, `PTE (${pte.id}) ${pte.practice.title}`));
        }

        for (let item of index.surveyItems) {
          console.log(
            this.tab(
              3,
              `ITEM (${item.id}-${item.qualtricsId}) ${item.qualtricsText}`
            )
          );

          for (let response of item.surveyItemResponses) {
            console.log(
              this.tab(
                4,
                `RESP (${response.id}) ${response.label}, ${response.value}`
              )
            );
          }
        }
      }
    }
  }

  public asJSON() {
    for (let dim of this.survey.surveyDimensions) {
      console.log(`DIM (${dim.id}) ${dim.title}`);

      for (let index of dim.surveyIndices) {
        console.log(
          this.tab(
            1,
            `IDX (${index.id}), ${index.title} => ${index.meanResponse()}`
          )
        );

        for (let pte of index.predictionTableEntries) {
          console.log(this.tab(2, `PTE (${pte.id}) ${pte.practice.title}`));
        }

        for (let item of index.surveyItems) {
          console.log(
            this.tab(
              3,
              `ITEM (${item.id}-${item.qualtricsId}) ${item.qualtricsText}`
            )
          );

          for (let response of item.surveyItemResponses) {
            console.log(
              this.tab(
                4,
                `RESP (${response.id}) ${response.label}, ${response.value}`
              )
            );
          }
        }
      }
    }
  }
}
