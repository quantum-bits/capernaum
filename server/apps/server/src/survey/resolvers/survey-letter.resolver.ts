import { Resolver, Query, Args, Int, Mutation } from "@nestjs/graphql";
import {
  SurveyLetter,
  SurveyLetterCreateInput,
} from "@server/src/survey/entities";
import { SurveyLetterService } from "@server/src/survey/services";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("survey-letter");

@Resolver(() => SurveyLetter)
export class SurveyLetterResolver {
  constructor(private readonly surveyLetterService: SurveyLetterService) {}

  @Mutation(() => SurveyLetter, { description: "Create a new surveyLetter" })
  createSurveyLetter(
    @Args({
      name: "surveyLetterCreateInput",
      type: () => SurveyLetterCreateInput,
    })
    surveyLetterCreateInput: SurveyLetterCreateInput
  ) {
    return this.surveyLetterService.create(surveyLetterCreateInput);
  }

  @Query(() => SurveyLetter, { description: "Retrieve one survey letter" })
  surveyLetter(
    @Args({
      name: "id",
      description: "Survey letter ID",
      type: () => Int,
    })
    id: number
  ) {
    debug("surveyLetters(id=%d)", id);
    return this.surveyLetterService.readOne(id);
  }

  @Query(() => [SurveyLetter], { description: "Retrieve all survey letters" })
  surveyLetters() {
    return this.surveyLetterService.readAll();
  }
}
