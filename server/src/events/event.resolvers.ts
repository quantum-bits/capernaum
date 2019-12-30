import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EventService } from "./event.service";
import { Event, EventCreateInput } from "./entities";

@Resolver(of => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(returns => Event)
  createEvent(@Args("createInput") createInput: EventCreateInput) {
    return this.eventService.create(Event, createInput);
  }

  @Query(returns => [Event])
  events() {
    return this.eventService.find(Event);
  }
}
