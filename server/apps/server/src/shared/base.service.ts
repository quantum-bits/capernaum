import { Repository } from "typeorm";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("service");

export class BaseService<Entity> {
  constructor(private readonly entityRepo: Repository<Entity>) {}

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

    if (entity[propertyPath]) {
      debugMessage("parent");
      return entity[propertyPath];
    }

    debugMessage("database");
    const query = this.entityRepo
      .createQueryBuilder()
      .relation(propertyPath)
      .of(entity);
    return multiple ? query.loadMany() : query.loadOne();
  }

  resolveOne(entity: Entity, propertyPath: string) {
    return this._resolve(entity, propertyPath, false);
  }

  resolveMany(entity: Entity, propertyPath: string) {
    return this._resolve(entity, propertyPath, true);
  }
}

// Credits:
// https://stackoverflow.com/a/60574675/1477144
