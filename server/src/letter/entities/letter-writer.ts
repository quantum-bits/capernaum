import { Field, InputType, Int, ObjectType } from "type-graphql";
import { ResponseSummary } from "../../survey/entities/survey-response-summary";

@InputType()
export class LetterWriterInput {
  @Field(type => Int) letterId: number;
  @Field(type => Int) surveyResponseId: number;
}

@ObjectType()
export class LetterWriterOutput {
  @Field() ok: boolean;
  @Field() pdfFileName: string;
  @Field(type => ResponseSummary) responseSummary: ResponseSummary;
}
