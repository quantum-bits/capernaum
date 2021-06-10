import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  SurveyLetter,
  SurveyLetterCreateInput,
  SurveyLetterUpdateInput,
} from "../entities";
import { SurveyLetterService } from "../services";
import { Int } from "@nestjs/graphql";

@Resolver("SurveyLetter")
export class SurveyLetterResolver {
  constructor(private readonly surveyLetterService: SurveyLetterService) {}

  @Mutation(() => SurveyLetter)
  surveyLetterCreate(
    @Args("createInput") createInput: SurveyLetterCreateInput
  ) {
    return this.surveyLetterService.create(createInput);
  }

  @Query(() => [SurveyLetter])
  readSurveyLetters() {
    return this.surveyLetterService.readAll();
  }

  @Mutation(() => SurveyLetter)
  surveyLetterUpdate(
    @Args("updateInput") updateInput: SurveyLetterUpdateInput
  ) {
    return this.surveyLetterService.update(updateInput);
  }

  @Mutation(() => Int)
  surveyLetterDelete(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyLetterService.delete(id);
  }
}
