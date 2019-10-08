import { EntityManager, FindConditions, ObjectType, Repository } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { validate } from "class-validator";
import { SurveyUpdateInput } from "../survey/entities";

export class BaseService {
  constructor(protected readonly entityManager: EntityManager) {}

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

  readOne<Entity>(entityClass: ObjectType<Entity>, id: number) {
    return this.entityManager.findOne(entityClass, id);
  }

  readAll<Entity>(entityClass: ObjectType<Entity>) {
    return this.entityManager.find(entityClass);
  }

  findOneOrFail<Entity>(entityClass: ObjectType<Entity>, id: number) {
    return this.entityManager.findOneOrFail(entityClass, id);
  }

  find<Entity>(
    entityClass: ObjectType<Entity>,
    conditions: FindConditions<Entity>
  ) {
    return this.entityManager.find(entityClass, conditions);
  }

  async update<Entity, UpdateInput>(
    entityClass: ObjectType<Entity>,
    updateInput: UpdateInput
  ) {
    const preload = await this.entityManager.preload(entityClass, updateInput);
    return this.entityManager.save(entityClass, preload);
  }

  delete<Entity>(entityClass: ObjectType<Entity>, id: number) {
    return this.entityManager.delete(entityClass, id);
  }
}
