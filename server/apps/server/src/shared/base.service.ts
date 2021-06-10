import { Repository } from "typeorm";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("service");

export class BaseService<Entity> {
  constructor(private readonly entityRepo: Repository<Entity>) {}

  /**
   * Resolve a related entity or entities.
   * N.B., if the entity/entities _already_ resolved (e.g., from a previous database fetch),
   * return the already-resolved entity/entities without hitting the database.
   * @param entity The "from" entity; we want to find an entity related to this one.
   * @param propertyPath The path to the "to" entity
   * @param multiple Resolve multiple "to" entities?
   */
  _resolve(entity: Entity, propertyPath: string, multiple: boolean) {
    function debugMessage(where: string) {
      debug(
        "resolve '%s' (%s) in %s from %s",
        propertyPath,
        multiple ? "Many" : "One",
        entity.constructor.name,
        where
      );
    }

    // The property path already has a value. Assume that this entity has already been resolved,
    // often by a more expansive fetch of the parent entity from the database.
    if (entity[propertyPath]) {
      debugMessage("parent");
      return entity[propertyPath];
    }

    // Otherwise, the property path does _not_ have a value. Hit the database to retrieve
    // the "to" entity or entities (depending on the value of the `multiple` flag).
    debugMessage("database");
    const query = this.entityRepo
      .createQueryBuilder()
      .relation(propertyPath)
      .of(entity);
    return multiple ? query.loadMany() : query.loadOne();
  }

  /**
   * Resolve a single related entity.
   * @param entity
   * @param propertyPath
   */
  resolveOne(entity: Entity, propertyPath: string) {
    return this._resolve(entity, propertyPath, false);
  }

  /**
   * Resolve multiple related entities.
   * @param entity
   * @param propertyPath
   */
  resolveMany(entity: Entity, propertyPath: string) {
    return this._resolve(entity, propertyPath, true);
  }
}

// Credits:
// https://stackoverflow.com/a/60574675/1477144
