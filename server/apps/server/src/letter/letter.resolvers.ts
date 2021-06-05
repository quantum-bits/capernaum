import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import {
  Letter,
  LetterCreateInput,
  LetterElement,
  LetterElementCreateInput,
  LetterElementType,
  LetterElementUpdateInput,
  LetterType,
  LetterTypeCreateInput,
  LetterTypeUpdateInput,
  LetterUpdateInput,
} from "./entities";
import {
  LetterElementTypeService,
  LetterService,
  LetterTypeService,
} from "./letter.service";
import { Int } from "@nestjs/graphql";
import { Survey, SurveyDimension } from "../survey/entities";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice,
} from "../prediction/entities";
import { Image } from "../image/entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { SurveyService } from "@server/src/survey/survey.service";
import { getDebugger } from '@helpers/debug-factory'

const debug = getDebugger("letter:resolver");

@Resolver(() => Letter)
@UseGuards(GqlAuthGuard)
export class LetterResolver {
  constructor(
    private readonly letterService: LetterService,
    private readonly surveyService: SurveyService
  ) {}

  @Mutation(() => Letter)
  createLetter(@Args("createInput") createInput: LetterCreateInput) {
    return this.letterService.create(Letter, createInput);
  }

  @Mutation(() => LetterElement)
  createLetterElement(
    @Args("createInput") createInput: LetterElementCreateInput
  ) {
    return this.letterService.create(LetterElement, createInput);
  }

  @Query(() => Letter)
  letter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.letter(id);
  }

  @Query(() => [Letter])
  letters() {
    return this.letterService.find(Letter);
  }

  @Mutation(() => Letter)
  updateLetter(@Args("letterData") letterData: LetterUpdateInput) {
    return this.letterService.update(Letter, letterData);
  }

  @Mutation(() => LetterElement)
  updateLetterElement(
    @Args("updateInput") updateInput: LetterElementUpdateInput
  ) {
    return this.letterService.update(LetterElement, updateInput);
  }

  @Mutation(() => Int)
  deleteLetter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.delete(Letter, id);
  }

  @Mutation(() => Int)
  deleteLetterElement(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.delete(LetterElement, id);
  }

  @ResolveField("scriptureEngagementPractices", () => [
    ScriptureEngagementPractice,
  ])
  resolveScriptureEngagementPractices(@Parent() survey: Survey) {
    return this.letterService.find(ScriptureEngagementPractice);
  }

  @ResolveField("survey", () => Survey)
  resolveSurvey(@Parent() letter: Letter) {
    return this.surveyService.findOne(Survey, letter.surveyId);
  }

  @ResolveField("letterElements", () => [LetterElement])
  resolveElements(@Parent() letter: Letter) {
    return this.letterService.letterElements(letter);
  }

  @ResolveField("tableEntries", () => [PredictionTableEntry])
  resolveEntries(@Parent() letter: Letter) {
    return this.letterService.tableEntries(letter);
  }

  @ResolveField("letterType", () => LetterType)
  resolveLetterType(@Parent() letter: Letter) {
    debug("resolveLetterType(%O)", letter);
    return this.letterService.findOneOrFail(LetterType, letter.letterTypeId);
  }
}

@Resolver(() => LetterElement)
@UseGuards(GqlAuthGuard)
export class LetterElementResolver {
  constructor(private readonly letterService: LetterService) {}

  @ResolveField("letterElementType", () => LetterElementType)
  resolveLetterElementType(@Parent() letterElement: LetterElement) {
    return this.letterService.findOneOrFail(
      LetterElementType,
      letterElement.letterElementTypeId
    );
  }

  @ResolveField("image", () => Image, { nullable: true })
  resolveImage(@Parent() letterElement: LetterElement) {
    if (letterElement.imageId) {
      return this.letterService.findOneOrFail(Image, letterElement.imageId);
    } else {
      return null;
    }
  }

  @ResolveField("surveyDimension", () => SurveyDimension, {
    nullable: true,
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

@Resolver(() => LetterElementType)
@UseGuards(GqlAuthGuard)
export class LetterElementTypeResolver {
  constructor(
    private readonly letterService: LetterService,
    private readonly letterElementTypeService: LetterElementTypeService
  ) {}

  @Query(() => [LetterElementType])
  letterElementTypes() {
    return this.letterService.letterElementTypes();
  }

  @ResolveField("letterTypes", () => [LetterType])
  resolveLetterTypes(@Parent() letterElementType: LetterElementType) {
    debug("resolveLetterTypes(%O)", letterElementType);
    return this.letterElementTypeService.readLetterTypes(letterElementType);
  }
}

@Resolver(() => LetterType)
@UseGuards(GqlAuthGuard)
export class LetterTypeResolver {
  constructor(private readonly letterTypeService: LetterTypeService) {}

  @Mutation(() => LetterType)
  createLetterType(@Args("createInput") createInput: LetterTypeCreateInput) {
    return this.letterTypeService.createLetterType(createInput);
  }

  @Query(() => [LetterType])
  readLetterTypes() {
    return this.letterTypeService.readLetterTypes();
  }

  @Mutation(() => LetterType)
  updateLetterType(@Args("updateInput") updateInput: LetterTypeUpdateInput) {
    return this.letterTypeService.updateLetterType(updateInput);
  }

  @Mutation(() => Int)
  deleteLetterType(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterTypeService.deleteLetterType(id);
  }

  @ResolveField("letterElementTypes", () => [LetterElementType])
  resolveLetterElementTypes(@Parent() letterType: LetterType) {
    debug("resolveLetterElementTypes(%O)", letterType);
    return this.letterTypeService.readLetterElementTypes(letterType);
  }
}
