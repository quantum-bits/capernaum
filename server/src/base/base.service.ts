import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class BaseService<EntityType, InputType, UpdateType> {
  constructor(private readonly repository: Repository<EntityType>) {}

  create(createInput: InputType) {
    const newEntity = this.repository.create(createInput);
    return this.repository.save(newEntity);
  }

  readOne(id: number): Promise<EntityType> {
    return this.repository.findOne(id);
  }

  readAll(): Promise<EntityType[]> {
    return this.repository.find();
  }

  async update(updateInput: UpdateType & { id: number }) {
    const oldEntity = await this.repository.findOne(updateInput.id);

    for (let prop of Object.keys(updateInput)) {
      if (prop !== "id") {
        oldEntity[prop] = updateInput[prop];
      }
    }

    return this.repository.save(oldEntity);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
