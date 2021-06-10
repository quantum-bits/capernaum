import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Machine, MachineCreateInput } from "./entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { MachineService } from "./machine.service";
import { Int } from "@nestjs/graphql";

@Resolver(() => Machine)
@UseGuards(GqlAuthGuard)
export class MachineResolver {
  constructor(protected readonly machineService: MachineService) {}

  @Mutation(() => Machine)
  createMachine(@Args("createInput") createInput: MachineCreateInput) {
    return this.machineService.create(createInput);
  }

  @Query(() => [Machine])
  machines() {
    return this.machineService.readAll();
  }

  @Mutation(() => Int)
  deleteMachine(@Args({ name: "id", type: () => Int }) id: number) {
    return this.machineService.delete(id);
  }
}
