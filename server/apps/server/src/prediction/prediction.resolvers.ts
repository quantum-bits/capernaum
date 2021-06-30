import {
  Args,
  Mutation,
  Query,
  Resolver,
} from "@nestjs/graphql";
import {
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput,
  ScriptureEngagementPracticeUpdateInput,
} from "./entities";
import { ScriptureEngagementPracticeService } from "./prediction.service";
import { Int } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

@Resolver(() => ScriptureEngagementPractice)
@UseGuards(GqlAuthGuard)
export class ScriptureEngagementPracticeResolver {
  constructor(
    private readonly scriptureEngagementPracticeService: ScriptureEngagementPracticeService
  ) {}

  @Mutation(() => ScriptureEngagementPractice, {
    description: "Create a scripture engagement practice",
  })
  createScriptureEngagementPractice(
    @Args("createInput") createInput: ScriptureEngagementPracticeCreateInput
  ) {
    return this.scriptureEngagementPracticeService.create(createInput);
  }

  @Query(() => ScriptureEngagementPractice)
  scriptureEngagementPractice(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.scriptureEngagementPracticeService.readOne(id);
  }

  @Query(() => [ScriptureEngagementPractice])
  scriptureEngagementPractices() {
    return this.scriptureEngagementPracticeService.readAll();
  }

  @Mutation(() => ScriptureEngagementPractice)
  updateScriptureEngagementPractice(
    @Args("updateData") updateData: ScriptureEngagementPracticeUpdateInput
  ) {
    return this.scriptureEngagementPracticeService.update(updateData);
  }

  @Mutation(() => Int)
  deleteScriptureEngagementPractice(
    @Args({ name: "id", type: () => Int }) id: number
  ) {
    return this.scriptureEngagementPracticeService.delete(id);
  }
}
