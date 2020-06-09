import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Machine, MachineCreateInput } from "./entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { MachineService } from "./machine.service";
import { Int } from "@nestjs/graphql";

@Resolver(of => Machine)
@UseGuards(GqlAuthGuard)
export class MachineResolver {
  constructor(protected readonly machineService: MachineService) {}

  @Mutation(returns => Machine)
  createMachine(@Args("createInput") createInput: MachineCreateInput) {
    return this.machineService.create(Machine, createInput);
  }

  @Query(returns => [Machine])
  machines() {
    return this.machineService.find(Machine);
  }

  @Mutation(returns => Int)
  deleteMachine(@Args({ name: "id", type: () => Int }) id: number) {
    return this.machineService.delete(Machine, id);
  }
}
