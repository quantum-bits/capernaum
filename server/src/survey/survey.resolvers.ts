import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import {
  QualtricsImportInput,
  Survey,
  SurveyCreateInput,
  SurveyDimension,
  SurveyItem,
  SurveyUpdateInput
} from "./entities";
import { SurveyService } from "./survey.service";
import { QualtricsService } from "../qualtrics/qualtrics.service";
import { Int } from "type-graphql";

@Resolver(of => Survey)
export class SurveyResolver {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly qualtricsService: QualtricsService
  ) {}

  @Mutation(returns => Survey)
  createSurvey(@Args("createInput") createInput: SurveyCreateInput) {
    return this.surveyService.create(createInput);
  }

  @Query(returns => [Survey])
  surveys() {
    return this.surveyService.readAll();
  }

  @Query(returns => Survey)
  survey(@Args({ name: "id", type: () => Int }) id: number) {
    return this.surveyService.readOne(id);
  }

  @Mutation(returns => Survey)
  updateSurvey(@Args("updateInput") updateInput: SurveyUpdateInput) {
    return this.surveyService.update(updateInput);
  }

  @ResolveProperty(type => [SurveyItem])
  surveyItems(@Parent() survey) {
    return this.surveyService.itemsForSurvey(survey);
  }

  @ResolveProperty(type => [SurveyDimension])
  surveyDimensions(@Parent() survey) {
    return this.surveyService.dimensionsForSurvey(survey);
  }

  @Mutation(returns => Survey, {
    description: "Import a survey from Qualtrics"
  })
  async importQualtricsSurvey(
    @Args("importInput") qualtricsImportInput: QualtricsImportInput
  ) {
    // Fetch the survey with the given ID from the Qualtrics API.
    const qualtricsSurvey = await this.qualtricsService.getSurvey(
      qualtricsImportInput.qualtricsId
    );

    // Import survey into the database.
    return this.surveyService.importQualtricsSurvey(
      qualtricsImportInput,
      qualtricsSurvey
    );
  }
}
