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
  SurveyLetter
} from "./entities";
import { LetterService } from "./letter.service";
import { Int } from "type-graphql";
import { DeleteResult } from "typeorm";
import { Survey } from "../survey/entities";
import { PredictionTable } from "../prediction/entities";

@Resolver(of => SurveyLetter)
export class SurveyLetterResolver {
  constructor(private readonly letterService: LetterService) {}

  @Query(returns => SurveyLetter)
  surveyLetter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.readOne(SurveyLetter, id);
  }

  @Query(returns => [SurveyLetter])
  surveyLetters() {
    return this.letterService.readAll(SurveyLetter);
  }

  @ResolveProperty("letter", type => Letter)
  resolveLetter(@Parent() surveyLetter: SurveyLetter) {
    return this.letterService.findOneOrFail(Letter, surveyLetter.letterId);
  }

  @ResolveProperty("survey", type => Survey)
  resolveSurvey(@Parent() surveyLetter: SurveyLetter) {
    return this.letterService.findOneOrFail(Survey, surveyLetter.surveyId);
  }

  @ResolveProperty("predictionTable", type => PredictionTable)
  resolvePredictionTable(@Parent() surveyLetter: SurveyLetter) {
    return this.letterService.findOneOrFail(
      PredictionTable,
      surveyLetter.predictionTableId
    );
  }
}

@Resolver(of => LetterElement)
export class LetterElementResolver {
  constructor(private readonly letterService: LetterService) {}

  @ResolveProperty("letterElementType", type => LetterElementType)
  resolveLetterElementType(@Parent() letterElement: LetterElement) {
    console.log("LETTER ELEMENT", letterElement);
    return this.letterService.findOneOrFail(
      LetterElementType,
      letterElement.letterElementTypeId
    );
  }
}

@Resolver(of => Letter)
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  @Mutation(returns => Letter)
  async createLetter(@Args("name") name: string) {
    return await this.letterService.createLetter(name);
  }

  @Query(returns => Letter)
  letter(@Args({ name: "id", type: () => Int }) id: number) {
    return this.letterService.readOne(Letter, id);
  }

  @Query(returns => [Letter])
  letters() {
    return this.letterService.readAll(Letter);
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

  @ResolveProperty("elements", type => [LetterElement])
  resolveElements(@Parent() letter: Letter) {
    return this.letterService.find(LetterElement, { letter });
  }
}

@Resolver(of => LetterElementType)
export class LetterElementTypeResolver {
  constructor(private readonly letterService: LetterService) {}

  @Query(returns => [LetterElementType])
  letterElementTypes() {
    return this.letterService.readAll(LetterElementType, {
      description: "ASC"
    });
  }
}
