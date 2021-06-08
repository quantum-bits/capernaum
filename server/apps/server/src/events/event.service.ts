import { Inject, Injectable } from "@nestjs/common";
import { OldBaseService } from "../shared/old-base.service";
import { Repository } from "typeorm";
import { Event, EventCreateInput } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { NEW_EVENT_TRIGGER_NAME, PUB_SUB_PROVIDER } from "./event.types";
import { PubSub } from "graphql-subscriptions";
import { getDebugger } from "@helpers/debug-factory";

const eventDebug = getDebugger("events");

@Injectable()
export class EventService extends OldBaseService {
  constructor(
    @Inject(PUB_SUB_PROVIDER) private readonly pubSub: PubSub,
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>
  ) {
    super();
  }

  async createEvent(createInput: EventCreateInput) {
    const newEvent = await this.eventRepo.save(
      this.eventRepo.create(createInput)
    );
    eventDebug("createEvent %O", newEvent);
    await this.pubSub.publish(NEW_EVENT_TRIGGER_NAME, { newEvent });
    eventDebug(`createdEvent triggered ${NEW_EVENT_TRIGGER_NAME}`);
  }
}
