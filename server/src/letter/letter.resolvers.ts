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
  LetterElementType,
  LetterUpdateInput,
  LetterWriterInput
} from "./entities";
import { LetterService } from "./letter.service";
import { Int } from "type-graphql";
import { DeleteResult } from "typeorm";
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
  async createLetter(@Args("name") name: string) {
    return await this.letterService.createLetter(name);
  }

  @Query(returns => Letter)
  letter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.findOne(Letter, id);
  }

  @Query(returns => [Letter])
  letters() {
    return this.letterService.find(Letter);
  }

  @Mutation(returns => Letter)
  async updateLetter(@Args("letterData") letterData: LetterUpdateInput) {
    return await this.letterService.updateLetter(letterData);
  }

  @Mutation(returns => Int)
  async deleteLetter(@Args({ name: "id", type: () => Int }) id: number) {
    const result: DeleteResult = await this.letterService.delete(Letter, id);
    return result.affected;
  }

  @Mutation(returns => String)
  writeLetter(@Args("letterWriterInput") letterWriterInput: LetterWriterInput) {
    const writer = new LaTeXWriter(this.letterService);
    const letter = writer.render(letterWriterInput);
    console.log("LETTER", letter);
    return letter;
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
