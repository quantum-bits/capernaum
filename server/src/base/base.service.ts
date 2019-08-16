import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class BaseService<EntityType> {
  constructor(private readonly repository: Repository<EntityType>) {}

  readOne(id: number): Promise<EntityType> {
    return this.repository.findOne(id);
  }

  readAll(): Promise<EntityType[]> {
    return this.repository.find();
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
