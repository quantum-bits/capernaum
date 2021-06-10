import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { EventService } from "./event.service";
import { Event, EventCreateInput } from "./entities";
import { NEW_EVENT_TRIGGER_NAME, PUB_SUB_PROVIDER } from "./event.types";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { getDebugger } from "@helpers/debug-factory";

const eventDebug = getDebugger("events");

@Resolver(() => Event)
export class EventResolver {
  constructor(
    private readonly eventService: EventService,
    @Inject(PUB_SUB_PROVIDER) private readonly pubSub: PubSub
  ) {}

  @Mutation(() => Event)
  createEvent(@Args("createInput") createInput: EventCreateInput) {
    return this.eventService.createEvent(createInput);
  }

  @Query(() => [Event])
  events() {
    return this.eventService.readAll();
  }

  @Subscription(() => Event)
  newEvent() {
    eventDebug("newEvent Subscription");
    return this.pubSub.asyncIterator(NEW_EVENT_TRIGGER_NAME);
  }
}
