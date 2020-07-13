import {
  DeleteResult,
  EntityManager,
  FindConditions,
  FindManyOptions,
  ObjectType,
} from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { validate } from "class-validator";
import { Inject } from "@nestjs/common";

export class BaseService {
  @Inject()
  protected readonly entityManager: EntityManager;

  create<Entity, CreateInput>(
    entityClass: ObjectType<Entity>,
    createInput: CreateInput
  ) {
    return this.entityManager.save(
      entityClass,
      this.entityManager.create(entityClass, createInput)
    );
  }

  async validateAndSave(entity: AbstractEntity) {
    const errors = await validate(entity);
    if (errors.length) {
      throw new Error(errors.toString());
    } else {
      return this.entityManager.save(entity);
    }
  }

  find<Entity>(
    entityClass: ObjectType<Entity>,
    conditions?: FindConditions<Entity> | FindManyOptions<Entity>
  ) {
    return this.entityManager.find(entityClass, conditions);
  }

  findOne<Entity>(entityClass: ObjectType<Entity>, id: number) {
    return this.entityManager.findOne(entityClass, id);
  }

  findOneOrFail<Entity>(entityClass: ObjectType<Entity>, id: number) {
    return this.entityManager.findOneOrFail(entityClass, id);
  }

  async update<Entity, UpdateInput>(
    entityClass: ObjectType<Entity>,
    updateInput: UpdateInput
  ) {
    const preload = await this.entityManager.preload(entityClass, updateInput);
    return this.entityManager.save(entityClass, preload);
  }

  async delete<Entity>(entityClass: ObjectType<Entity>, id: number) {
    const result: DeleteResult = await this.entityManager.delete(
      entityClass,
      id
    );
    return result.affected;
  }
}
