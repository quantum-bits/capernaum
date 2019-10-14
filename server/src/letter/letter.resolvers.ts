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
  LetterElement,
  LetterElementCreateInput,
  LetterElementType,
  LetterElementUpdateInput,
  LetterUpdateInput,
  LetterWriterInput
} from "./entities";
import { LetterService } from "./letter.service";
import { Int } from "type-graphql";
import { Survey } from "../survey/entities";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice
} from "../prediction/entities";
import LaTeXWriter from "./letter.writer";

@Resolver(of => Letter)
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  @Mutation(returns => Letter)
  createLetter(@Args("title") title: string) {
    return this.letterService.createLetter(title);
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

  @Mutation(returns => String)
  async writeLetter(
    @Args("letterWriterInput") letterWriterInput: LetterWriterInput
  ) {
    const letter = await this.letterService.letter(letterWriterInput.letterId);
    const writer = new LaTeXWriter();
    const result = await writer.render(letter);
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
}

@Resolver(of => LetterElementType)
export class LetterElementTypeResolver {
  constructor(private readonly letterService: LetterService) {}

  @Query(returns => [LetterElementType])
  letterElementTypes() {
    return this.letterService.letterElementTypes();
  }
}
