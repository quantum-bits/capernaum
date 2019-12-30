import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { EventService } from "./event.service";
import { Event, EventCreateInput } from "./entities";
import { PubSub } from "graphql-subscriptions";

@Resolver(of => Event)
export class EventResolver {
  private readonly pubSub;

  constructor(private readonly eventService: EventService) {
    this.pubSub = new PubSub();
  }

  @Mutation(returns => Event)
  createEvent(@Args("createInput") createInput: EventCreateInput) {
    return this.eventService.create(Event, createInput);
  }

  @Query(returns => [Event])
  events() {
    return this.eventService.find(Event);
  }

  @Subscription(returns => Event)
  newEvent() {
    return this.pubSub.asyncIterator("newEvent");
  }
}
