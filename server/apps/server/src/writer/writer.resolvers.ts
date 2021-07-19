import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { WriterInput, WriterOutput } from "./entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { Letter } from "../letter/entities";
import { WriterService } from "./writer.service";

@Resolver(() => Letter)
@UseGuards(GqlAuthGuard)
export class WriterResolver {
  constructor(private readonly letterWriter: WriterService) {}

  @Mutation(() => WriterOutput)
  async writeLetter(@Args("writerInput") writerInput: WriterInput) {
    return this.letterWriter.renderLetter(
      writerInput.letterId,
      writerInput.responseOrGroupId
    );
  }
}
