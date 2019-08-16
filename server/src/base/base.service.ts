import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class BaseService<EntityType> {
  constructor(private readonly baseRepository: Repository<EntityType>) {}

  readOne(id: number): Promise<EntityType> {
    return this.baseRepository.findOne(id);
  }

  readAll(): Promise<EntityType[]> {
    return this.baseRepository.find();
  }

  delete(id: number) {
    return this.baseRepository.delete(id);
  }
}
