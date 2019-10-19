import { Field, InputType, Int } from "type-graphql";

@InputType()
export class LetterWriterInput {
  @Field(type => Int) letterId: number;
  @Field(type => Int) surveyResponseId: number;
}
