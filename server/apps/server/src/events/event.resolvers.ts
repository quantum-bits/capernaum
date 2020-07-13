import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { EventService } from "./event.service";
import { Event, EventCreateInput } from "./entities";
import debug from "debug";
import { NEW_EVENT_TRIGGER_NAME, PUB_SUB_PROVIDER } from "./event.types";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";

const eventDebug = debug("events");

@Resolver(of => Event)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    @Inject(PUB_SUB_PROVIDER) private readonly pubSub: PubSub
  ) {}

  @Mutation(returns => Event)
  createEvent(@Args("createInput") createInput: EventCreateInput) {
    return this.eventService.createEvent(createInput);
  }

  @Query(returns => [Event])
  events() {
    return this.eventService.find(Event);
  }

  @Subscription(returns => Event)
  newEvent() {
    eventDebug("newEvent Subscription");
    return this.pubSub.asyncIterator(NEW_EVENT_TRIGGER_NAME);
  }
}
