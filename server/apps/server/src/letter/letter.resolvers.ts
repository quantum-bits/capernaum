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
  LetterElementService,
  LetterElementTypeService,
  LetterService,
  LetterTypeService,
} from "./letter.service";
import { Int } from "@nestjs/graphql";
import { SurveyDimension } from "../survey/entities";
import { Image } from "../image/entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("letter");

@Resolver(() => Letter)
@UseGuards(GqlAuthGuard)
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  @Mutation(() => Letter)
  createLetter(@Args("createInput") createInput: LetterCreateInput) {
    return this.letterService.construct(createInput);
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
    debug("deleteLetter/%d", id);
    return this.letterService.delete(id);
  }
}

@Resolver(() => LetterElement)
@UseGuards(GqlAuthGuard)
export class LetterElementResolver {
  constructor(private readonly letterElementService: LetterElementService) {}

  @Mutation(() => LetterElement)
  createLetterElement(
    @Args("createInput") createInput: LetterElementCreateInput
  ) {
    return this.letterElementService.create(createInput);
  }

  @Mutation(() => LetterElement)
  updateLetterElement(
    @Args("updateInput") updateInput: LetterElementUpdateInput
  ) {
    return this.letterElementService.update(updateInput);
  }

  @Mutation(() => [LetterElement])
  resequenceLetterElements(
    @Args({ name: "letterElementIds", type: () => [Int] })
    letterElementIds: number[]
  ) {
    return this.letterElementService.resequence(letterElementIds);
  }

  @Mutation(() => Int)
  deleteLetterElement(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterElementService.delete(id);
  }

  @ResolveField("image", () => Image, { nullable: true })
  resolveImage(@Parent() letterElement: LetterElement) {
    debug("LetterElementResolver.resolveImage/%O", letterElement);
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
}

@Resolver(() => LetterElementType)
@UseGuards(GqlAuthGuard)
export class LetterElementTypeResolver {
  constructor(
    private readonly letterElementTypeService: LetterElementTypeService
  ) {}

  @Query(() => [LetterElementType])
  letterElementTypes() {
    return this.letterElementTypeService.readAll();
  }

  @ResolveField("letterTypes", () => [LetterType])
  resolveLetterTypes(@Parent() letterElementType: LetterElementType) {
    return this.letterElementTypeService.resolveLetterTypes(letterElementType);
  }
}

@Resolver(() => LetterType)
@UseGuards(GqlAuthGuard)
export class LetterTypeResolver {
  constructor(private readonly letterTypeService: LetterTypeService) {}

  @Mutation(() => LetterType)
  createLetterType(@Args("createInput") createInput: LetterTypeCreateInput) {
    return this.letterTypeService.construct(createInput);
  }

  @Query(() => [LetterType])
  readLetterTypes() {
    return this.letterTypeService.readAll();
  }

  @Mutation(() => LetterType)
  updateLetterType(@Args("updateInput") updateInput: LetterTypeUpdateInput) {
    return this.letterTypeService.update(updateInput);
  }
}
