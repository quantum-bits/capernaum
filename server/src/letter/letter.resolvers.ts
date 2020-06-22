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
  LetterUpdateInput,
} from "./entities";
import { LetterService } from "./letter.service";
import { Int } from "@nestjs/graphql";
import { Survey, SurveyDimension } from "../survey/entities";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice,
} from "../prediction/entities";
import { Image } from "../image/entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { EntityManager } from "typeorm";

@Resolver((of) => Letter)
@UseGuards(GqlAuthGuard)
export class LetterResolver {
  constructor(
    protected readonly entityManager: EntityManager,
    private readonly letterService: LetterService
  ) {}

  @Mutation((returns) => Letter)
  createLetter(@Args("createInput") createInput: LetterCreateInput) {
    return this.letterService.create(Letter, createInput);
  }

  @Mutation((returns) => LetterElement)
  createLetterElement(
    @Args("createInput") createInput: LetterElementCreateInput
  ) {
    return this.letterService.create(LetterElement, createInput);
  }

  @Query((returns) => Letter)
  letter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.letter(id);
  }

  @Query((returns) => [Letter])
  letters() {
    return this.letterService.find(Letter);
  }

  @Mutation((returns) => Letter)
  updateLetter(@Args("letterData") letterData: LetterUpdateInput) {
    return this.letterService.update(Letter, letterData);
  }

  @Mutation((returns) => LetterElement)
  updateLetterElement(
    @Args("updateInput") updateInput: LetterElementUpdateInput
  ) {
    return this.letterService.update(LetterElement, updateInput);
  }

  @Mutation((returns) => Int)
  deleteLetter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.delete(Letter, id);
  }

  @Mutation((returns) => Int)
  deleteLetterElement(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.delete(LetterElement, id);
  }

  @ResolveField("scriptureEngagementPractices", (type) => [
    ScriptureEngagementPractice,
  ])
  resolveScriptureEngagementPractices(@Parent() survey: Survey) {
    return this.letterService.find(ScriptureEngagementPractice);
  }

  @ResolveField("survey", (type) => Survey)
  resolveSurvey(@Parent() letter: Letter) {
    return this.entityManager.findOne(Survey, letter.surveyId);
  }

  @ResolveField("letterElements", (type) => [LetterElement])
  resolveElements(@Parent() letter: Letter) {
    return this.letterService.letterElements(letter);
  }

  @ResolveField("tableEntries", (type) => [PredictionTableEntry])
  resolveEntries(@Parent() letter: Letter) {
    return this.letterService.tableEntries(letter);
  }
}

@Resolver((of) => LetterElement)
@UseGuards(GqlAuthGuard)
export class LetterElementResolver {
  constructor(private readonly letterService: LetterService) {}

  @ResolveField("letterElementType", (type) => LetterElementType)
  resolveLetterElementType(@Parent() letterElement: LetterElement) {
    return this.letterService.findOneOrFail(
      LetterElementType,
      letterElement.letterElementTypeId
    );
  }

  @ResolveField("image", (type) => Image, { nullable: true })
  resolveImage(@Parent() letterElement: LetterElement) {
    if (letterElement.imageId) {
      return this.letterService.findOneOrFail(Image, letterElement.imageId);
    } else {
      return null;
    }
  }

  @ResolveField("surveyDimension", (type) => SurveyDimension, {
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

@Resolver((of) => LetterElementType)
@UseGuards(GqlAuthGuard)
export class LetterElementTypeResolver {
  constructor(private readonly letterService: LetterService) {}

  @Query((returns) => [LetterElementType])
  letterElementTypes() {
    return this.letterService.letterElementTypes();
  }
}
