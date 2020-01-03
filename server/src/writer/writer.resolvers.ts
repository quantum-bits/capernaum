import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { WriterInput, WriterOutput } from "./entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { Letter } from "../letter/entities";
import { LetterService } from "../letter/letter.service";
import WriterService from "./writer.service";
import { SurveyService } from "../survey/survey.service";

@Resolver(of => Letter)
@UseGuards(GqlAuthGuard)
export class WriterResolver {
  constructor(
    private readonly letterService: LetterService,
    private readonly letterWriter: WriterService,
    private readonly surveyService: SurveyService
  ) {}

  @Mutation(returns => WriterOutput)
  async writeLetter(@Args("writerInput") writerInput: WriterInput) {
    const letter = await this.letterService.letter(writerInput.letterId);
    const surveyResponse = await this.surveyService.surveyResponseComplete(
      writerInput.surveyResponseId
    );

    return this.letterWriter.renderLetter(letter, surveyResponse);
  }
}
