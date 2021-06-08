import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  Repository,
} from "typeorm";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";

export class BaseService<Entity> {
  constructor(private readonly repo: Repository<Entity>) {}

  create<CreateInput>(createInput: CreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  createQueryBuilder() {
    return this.repo.createQueryBuilder();
  }

  find(conditions?: FindConditions<Entity> | FindManyOptions<Entity>) {
    return this.repo.find(conditions);
  }

  findOne(id: number, options?: FindOneOptions<Entity>) {
    return this.repo.findOne(id, options);
  }

  findOneOrFail(id: number) {
    return this.repo.findOneOrFail(id);
  }

  async update<UpdateInput>(updateInput: UpdateInput) {
    const preload = await this.repo.preload(updateInput);
    return this.repo.save(preload);
  }

  async delete(id: number) {
    const result: DeleteResult = await this.repo.delete(id);
    return result.affected;
  }
}

// Credits:
// https://stackoverflow.com/a/60574675/1477144
