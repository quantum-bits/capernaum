import { Resolver, Query, Args, Int, Mutation } from "@nestjs/graphql";
import {
  SurveyLetter,
  SurveyLetterCreateInput,
} from "@server/src/survey/entities";
import { SurveyLetterService } from "@server/src/survey/services";

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

  @Query(() => [SurveyLetter], { description: "Retrieve all survey letters" })
  surveyLetters(
    @Args({
      name: "id",
      description: "Optional survey letter ID",
      type: () => Int,
      nullable: true,
    })
    id?: number
  ) {
    if (id !== undefined) {
      return this.surveyLetterService.readOne(id);
    } else {
      return this.surveyLetterService.readAll();
    }
  }
}
