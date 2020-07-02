import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { WriterInput, WriterOutput } from "./entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { Letter } from "../letter/entities";
import { LetterService } from "../letter/letter.service";
import { WriterService } from "./writer.service";
import { SurveyService } from "../survey/survey.service";

@Resolver((of) => Letter)
@UseGuards(GqlAuthGuard)
export class WriterResolver {
  constructor(
    private readonly letterService: LetterService,
    private readonly letterWriter: WriterService,
    private readonly surveyService: SurveyService
  ) {}

  @Mutation((returns) => WriterOutput)
  async writeLetter(@Args("writerInput") writerInput: WriterInput) {
    return this.letterWriter.renderLetter(
      writerInput.letterId,
      writerInput.surveyResponseId
    );
  }
}
