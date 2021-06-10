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
  LetterElementType,
  LetterElementUpdateInput,
  LetterType,
  LetterTypeCreateInput,
  LetterTypeUpdateInput,
  LetterUpdateInput,
} from "./entities";
import {
  LetterElementService,
  LetterElementTypeService,
  LetterService,
  LetterTypeService,
} from "./letter.service";
import { Int } from "@nestjs/graphql";
import { Survey, SurveyDimension } from "../survey/entities";
import { PredictionTable } from "../prediction/entities";
import { Image } from "../image/entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("letter:resolver");

@Resolver(() => Letter)
@UseGuards(GqlAuthGuard)
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  @Mutation(() => Letter)
  createLetter(@Args("createInput") createInput: LetterCreateInput) {
    return this.letterService.create(createInput);
  }

  @Query(() => Letter)
  letter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.readOne(id);
  }

  @Query(() => [Letter])
  letters() {
    return this.letterService.readAll();
  }

  @Mutation(() => Letter)
  updateLetter(@Args("letterData") letterUpdateInput: LetterUpdateInput) {
    return this.letterService.update(letterUpdateInput);
  }

  @Mutation(() => Int)
  deleteLetter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.delete(id);
  }

  @ResolveField("survey", () => Survey)
  resolveSurvey(@Parent() letter: Letter) {
    return this.letterService.resolveRelatedSurvey(letter);
  }

  @ResolveField("letterElements", () => [LetterElement])
  resolveElements(@Parent() letter: Letter) {
    return this.letterService.letterElements(letter);
  }
}

@Resolver(() => LetterElement)
@UseGuards(GqlAuthGuard)
export class LetterElementResolver {
  constructor(private readonly letterElementService: LetterElementService) {}

  @Mutation(() => LetterElement)
  updateLetterElement(
    @Args("updateInput") updateInput: LetterElementUpdateInput
  ) {
    return this.letterElementService.update(updateInput);
  }

  @Mutation(() => Int)
  deleteLetterElement(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterElementService.delete(id);
  }

  @ResolveField("image", () => Image, { nullable: true })
  resolveImage(@Parent() letterElement: LetterElement) {
    return this.letterElementService.resolveRelatedImage(letterElement);
  }

  @ResolveField("surveyDimension", () => SurveyDimension, {
    nullable: true,
  })
  resolveSurveyDimension(@Parent() letterElement: LetterElement) {
    return this.letterElementService.resolveRelatedSurveyDimension(
      letterElement
    );
  }

  @ResolveField("predictionTable", () => PredictionTable, { nullable: true })
  resolvePredictionTable(@Parent() letterElement: LetterElement) {
    return this.letterElementService.resolveRelatedPredictionTable(
      letterElement
    );
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
