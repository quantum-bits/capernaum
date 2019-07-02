import { LetterService } from "./letter.service";
import { Letter } from "./letter.entities";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { string } from "@oclif/parser/lib/flags";

@Resolver(of => Letter)
export class LetterResolver {
  constructor(private readonly letterService: LetterService) {}

  @Query(returns => [Letter])
  async letters() {
    return await this.letterService.findAll();
  }

  @Mutation(returns => Letter)
  async addLetter(@Args({ name: "name", type: () => String }) name: string) {
    return await this.letterService.createLetter(name);
  }
}
