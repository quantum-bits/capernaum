import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Event, EventCreateInput } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { NEW_EVENT_TRIGGER_NAME, PUB_SUB_PROVIDER } from "./event.types";
import { PubSub } from "graphql-subscriptions";
import { getDebugger } from "@helpers/debug-factory";
import { BaseService } from "@server/src/shared/base.service";

const debug = getDebugger("events");

@Injectable()
export class EventService extends BaseService<Event> {
  constructor(
    @Inject(PUB_SUB_PROVIDER) private readonly pubSub: PubSub,
    @InjectRepository(Event) private readonly repo: Repository<Event>
  ) {
    super(repo);
  }

  async createEvent(createInput: EventCreateInput) {
    const newEvent = await this.repo.save(this.repo.create(createInput));
    await this.pubSub.publish(NEW_EVENT_TRIGGER_NAME, { newEvent });
  }

  readAll() {
    return this.repo.find({ order: { date: "ASC" } });
  }
}
