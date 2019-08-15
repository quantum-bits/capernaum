import { DeleteResult } from "typeorm";
import { ClassType, Int } from "type-graphql";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  SurveyCreateInput,
  SurveyUpdateInput
} from "../survey/survey.entities";

export function BaseResolver<EntityType extends ClassType>(
  EntityObject: EntityType
): any {
  const entityName = EntityObject.name.toLocaleUpperCase();

  @Resolver(EntityObject, { isAbstract: true })
  abstract class BaseResolver {
    constructor(private readonly service: any) {}

    @Mutation(returns => EntityObject, { name: `create${entityName}` })
    create(@Args("createInput") createInput: SurveyCreateInput) {
      return this.service.create(createInput);
    }

    @Query(type => [EntityObject], { name: `readAll${entityName}` })
    readAll() {
      return this.service.readAll();
    }

    @Query(type => EntityObject, { name: `readOne${entityName}` })
    readOne(@Args({ name: "id", type: () => Int }) id: number) {
      return this.service.readOne(id);
    }

    @Mutation(returns => EntityObject, { name: `update${entityName}` })
    update(@Args("updateInput") updateInput: SurveyUpdateInput) {
      return this.service.update(updateInput);
    }

    @Mutation(returns => Int, { name: `delete${entityName}` })
    async delete(@Args({ name: "id", type: () => Int }) id: number) {
      const result: DeleteResult = await this.service.delete(id);
      return result.affected;
    }
  }

  return BaseResolver;
}
