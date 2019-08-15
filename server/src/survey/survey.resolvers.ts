import { Resolver } from "@nestjs/graphql";
import { Survey } from "./survey.entities";
import { SurveyService } from "./survey.service";
import { BaseResolver } from "../base/base.resolver";

@Resolver(of => Survey)
export class SurveyResolver extends BaseResolver(Survey) {
  constructor(private readonly surveyService: SurveyService) {
    super(surveyService);
  }
}
