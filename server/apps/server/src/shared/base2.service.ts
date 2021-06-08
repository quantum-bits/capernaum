import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  Repository,
} from "typeorm";

export class BaseService2<Entity> {
  constructor(readonly repo: Repository<Entity>) {}

  create<CreateInput>(createInput: CreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  find(conditions?: FindConditions<Entity> | FindManyOptions<Entity>) {
    return this.repo.find(conditions);
  }

  findOne(id: number) {
    return this.repo.findOne(id);
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
