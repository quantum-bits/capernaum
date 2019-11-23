import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import {
  Letter,
  LetterCreateInput,
  LetterElement,
  LetterElementCreateInput,
  LetterElementType,
  LetterElementUpdateInput,
  LetterUpdateInput,
  LetterWriterInput,
  LetterWriterOutput
} from "./entities";
import { LetterService } from "./letter.service";
import { Int } from "type-graphql";
import { Survey, SurveyDimension } from "../survey/entities";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice
} from "../prediction/entities";
import LetterWriter from "./letter.writer";
import { SurveyService } from "../survey/survey.service";
import { Image } from "../image/entities";

@Resolver(of => Letter)
export class LetterResolver {
  constructor(
    private readonly letterService: LetterService,
    private readonly surveyService: SurveyService
  ) {}

  @Mutation(returns => Letter)
  createLetter(@Args("createInput") createInput: LetterCreateInput) {
    return this.letterService.create(Letter, createInput);
  }

  @Mutation(returns => LetterElement)
  createLetterElement(
    @Args("createInput") createInput: LetterElementCreateInput
  ) {
    return this.letterService.create(LetterElement, createInput);
  }

  @Query(returns => Letter)
  letter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.letter(id);
  }

  @Query(returns => [Letter])
  letters() {
    return this.letterService.find(Letter);
  }

  @Mutation(returns => Letter)
  updateLetter(@Args("letterData") letterData: LetterUpdateInput) {
    return this.letterService.update(Letter, letterData);
  }

  @Mutation(returns => LetterElement)
  updateLetterElement(
    @Args("updateInput") updateInput: LetterElementUpdateInput
  ) {
    return this.letterService.update(LetterElement, updateInput);
  }

  @Mutation(returns => Int)
  deleteLetter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.delete(Letter, id);
  }

  @Mutation(returns => Int)
  deleteLetterElement(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.delete(LetterElement, id);
  }

  @Mutation(returns => LetterWriterOutput)
  async writeLetter(
    @Args("letterWriterInput") letterWriterInput: LetterWriterInput
  ) {
    const letter = await this.letterService.letter(letterWriterInput.letterId);
    const surveyResponse = await this.surveyService.surveyResponse(
      letterWriterInput.surveyResponseId
    );

    const letterWriter = new LetterWriter();
    const result = await letterWriter.render(letter, surveyResponse);
    return result;
  }

  @ResolveProperty("scriptureEngagementPractices", type => [
    ScriptureEngagementPractice
  ])
  resolveScriptureEngagementPractices(@Parent() survey: Survey) {
    return this.letterService.find(ScriptureEngagementPractice);
  }

  @ResolveProperty("survey", type => Survey)
  resolveSurvey(@Parent() letter: Letter) {
    return this.letterService.findOneOrFail(Survey, letter.surveyId);
  }

  @ResolveProperty("letterElements", type => [LetterElement])
  resolveElements(@Parent() letter: Letter) {
    return this.letterService.letterElements(letter);
  }

  @ResolveProperty("tableEntries", type => [PredictionTableEntry])
  resolveEntries(@Parent() letter: Letter) {
    return this.letterService.tableEntries(letter);
  }
}

@Resolver(of => LetterElement)
export class LetterElementResolver {
  constructor(private readonly letterService: LetterService) {}

  @ResolveProperty("letterElementType", type => LetterElementType)
  resolveLetterElementType(@Parent() letterElement: LetterElement) {
    return this.letterService.findOneOrFail(
      LetterElementType,
      letterElement.letterElementTypeId
    );
  }

  @ResolveProperty("image", type => Image, { nullable: true })
  resolveImage(@Parent() letterElement: LetterElement) {
    if (letterElement.imageId) {
      return this.letterService.findOneOrFail(Image, letterElement.imageId);
    } else {
      return null;
    }
  }

  @ResolveProperty("surveyDimension", type => SurveyDimension, {
    nullable: true
  })
  resolveSurveyDimension(@Parent() letterElement: LetterElement) {
    if (letterElement.surveyDimensionId) {
      return this.letterService.findOneOrFail(
        SurveyDimension,
        letterElement.surveyDimensionId
      );
    } else {
      return null;
    }
  }
}

@Resolver(of => LetterElementType)
export class LetterElementTypeResolver {
  constructor(private readonly letterService: LetterService) {}

  @Query(returns => [LetterElementType])
  letterElementTypes() {
    return this.letterService.letterElementTypes();
  }
}
