import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Letter,
  LetterElementType,
  LetterUpdateInput
} from "./letter.entities";
import { LetterElementTypeService, LetterService } from "./letter.service";
import { Int } from "type-graphql";
import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";

@Resolver(of => Letter)
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  @Mutation(returns => Letter)
  async createLetter(@Args("name") name: string) {
    return await this.letterService.createLetter(name);
  }

  @Query(returns => [Letter])
  async letters() {
    console.error(`LETTERS!`);
    return await this.letterService.letters();
  }

  @Query(returns => Letter)
  async letter(@Args({ name: "id", type: () => Int }) id: number) {
    return await this.letterService.letter(id);
  }

  @Mutation(returns => Letter)
  async updateLetter(@Args("letterData") letterData: LetterUpdateInput) {
    return await this.letterService.updateLetter(letterData);
  }

  @Mutation(returns => Int)
  async deleteLetter(@Args({ name: "id", type: () => Int }) id: number) {
    const result: DeleteResult = await this.letterService.deleteLetter(id);
    return result.affected;
  }
}

@Resolver(of => LetterElementType)
export class LetterElementTypeResolver {
  constructor(
    private readonly letterElementTypeService: LetterElementTypeService
  ) {}

  @Query(returns => [LetterElementType])
  async letterElementTypes() {
    return await this.letterElementTypeService.letterElementTypes();
  }
}
