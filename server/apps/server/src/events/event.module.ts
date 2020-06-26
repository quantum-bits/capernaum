import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities";
import { EventResolver } from "./event.resolvers";
import { EventService } from "./event.service";
import { PUB_SUB_PROVIDER } from "./event.types";
import { PubSub } from "graphql-subscriptions";

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [
    {
      provide: PUB_SUB_PROVIDER,
      useValue: new PubSub()
    },
    EventResolver,
    EventService
  ],
  exports: [EventService]
})
export class EventModule {}
