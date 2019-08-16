import { DeleteResult } from "typeorm";
import { ClassType, Int } from "type-graphql";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plural } from "pluralize";

export function BaseResolver<EntityType extends ClassType>(
  EntityObject: EntityType
): any {
  const entityName = EntityObject.name;
  const singularEntityName = entityName.toLocaleLowerCase();
  const pluralEntityName = plural(singularEntityName);

  @Resolver(of => EntityObject, { isAbstract: true })
  abstract class BaseResolver {
    constructor(private readonly service: any) {}

    @Query(returns => [EntityObject], { name: pluralEntityName })
    readAll() {
      return this.service.readAll();
    }

    @Query(returns => EntityObject, { name: singularEntityName })
    readOne(@Args({ name: "id", type: () => Int }) id: number) {
      return this.service.readOne(id);
    }

    @Mutation(returns => Int, { name: `delete${entityName}` })
    async delete(@Args({ name: "id", type: () => Int }) id: number) {
      const result: DeleteResult = await this.service.delete(id);
      return result.affected;
    }
  }

  return BaseResolver;
}
