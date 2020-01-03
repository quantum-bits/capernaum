import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Machine, MachineCreateInput } from "./entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { MachineService } from "./machine.service";

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
}
