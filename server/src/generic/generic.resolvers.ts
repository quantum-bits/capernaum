// See https://typegraphql.ml/docs/inheritance.html#resolver-inheritance

import { ClassType, Int } from "type-graphql";
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";

// To generate unique query/mutation names, create factory function for base class.
export function createBaseResolver<T extends ClassType>(
  suffix: string, // Use for query/mutation names
  objectTypeCls: T // Type returned from resolvers
): any {
  @Resolver(objectTypeCls, { isAbstract: true })
  abstract class BaseResolver {
    constructor(private readonly genericService: any) {}

    @Query(type => [objectTypeCls], { name: `readAll${suffix}` })
    async readAll() {
      return this.genericService.readAll();
    }

    @Query(returns => objectTypeCls, { name: `readOne${suffix}` })
    async survey(@Args({ name: "id", type: () => Int }) id: number) {
      return await this.genericService.readOne(id);
    }
  }

  return BaseResolver;
}
