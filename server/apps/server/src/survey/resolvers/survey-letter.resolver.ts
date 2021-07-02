import { Resolver, Query } from "@nestjs/graphql";
import { SurveyLetter } from "@server/src/survey/entities";
import { SurveyLetterService } from "@server/src/survey/services";

@Resolver(() => SurveyLetter)
export class SurveyLetterResolver {
  constructor(private readonly surveyLetterService: SurveyLetterService) {}

  @Query(() => [SurveyLetter], { description: "Retrieve all survey letters" })
  surveyLetters() {
    return this.surveyLetterService.readAll();
  }
}
