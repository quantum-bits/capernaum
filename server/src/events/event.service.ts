import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { EntityManager } from "typeorm";

@Injectable()
export class EventService extends BaseService {
  constructor(protected readonly entityManager: EntityManager) {
    super(entityManager);
  }
}
