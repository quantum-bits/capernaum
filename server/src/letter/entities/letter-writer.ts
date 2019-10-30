import { Field, InputType, Int, ObjectType } from "type-graphql";

@InputType()
export class LetterWriterInput {
  @Field(type => Int) letterId: number;
  @Field(type => Int) surveyResponseId: number;
}

@ObjectType()
export class LetterWriterOutput {
  @Field() ok: boolean;
  @Field() pdfFilePath: string;
}
