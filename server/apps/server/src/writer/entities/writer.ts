import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { ResponseSummary } from "../../survey/entities";

@InputType()
export class WriterInput {
  @Field((type) => Int) letterId: number;
  @Field((type) => Int) surveyResponseId: number;
}

@ObjectType()
export class WriterOutput {
  @Field() ok: boolean;

  @Field({ description: "Message to UI" })
  message: string;

  @Field({ description: "Name of PDF file (e.g., 'abc.pdf')" })
  pdfFileName: string;

  @Field({
    description: "Relative path to PDF file (e.g., 'static/pdfs/abc.pdf')",
  })
  pdfRelativePath: string;

  @Field({
    description:
      "Absolute path to PDF file (e.g., '/home/capernaum/static/pdfs/abc.pdf')",
  })
  pdfAbsolutePath: string;

  @Field((type) => ResponseSummary, { nullable: true })
  responseSummary?: ResponseSummary;
}