import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Machine } from "./entities";
import { MachineResolver } from "./machine.resolvers";
import { MachineService } from "./machine.service";

@Module({
  imports: [TypeOrmModule.forFeature([Machine])],
  providers: [MachineService, MachineResolver]
})
export class MachineModule {}
