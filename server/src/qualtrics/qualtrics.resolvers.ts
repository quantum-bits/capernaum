import { Survey } from "./qualtrics.models";
import { Resolver, Query } from "@nestjs/graphql";

@Resolver(of => Survey)
export class SurveyResolver {
  @Query(returns => [Survey])
  surveys() {
    return [{ title: "Foo" }, { title: "Bar" }];
  }
}
