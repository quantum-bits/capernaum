import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { EventService } from "./event.service";
import { Event, EventCreateInput } from "./entities";
import { PubSub } from "graphql-subscriptions";
import debug from "debug";

const eventsDebug = debug("events");

@Resolver(of => Event)
export class EventResolver {
  private readonly pubSub;

  constructor(private readonly eventService: EventService) {
    this.pubSub = new PubSub();
    eventsDebug("pubSub %O", this.pubSub);
  }

  @Mutation(returns => Event)
  createEvent(@Args("createInput") createInput: EventCreateInput) {
    return this.eventService
      .create(Event, createInput)
      .then(newEvent => this.pubSub.publish("newEvent", { newEvent }))
      .then(result => console.log(result));
  }

  @Query(returns => [Event])
  events() {
    return this.eventService.find(Event);
  }

  @Subscription(returns => Event)
  newEvent() {
    eventsDebug("newEvent Subscription");
    return this.pubSub.asyncIterator("newEvent");
  }
}
