import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import { SurveyItemResponse } from "@server/src/survey/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SurveyItemResponseService extends BaseService<SurveyItemResponse> {
  constructor(
    @InjectRepository(SurveyItemResponse)
    private readonly repo: Repository<SurveyItemResponse>
  ) {
    super(repo);
  }

  resolveSurveyItem(surveyItemResponse: SurveyItemResponse) {
    return this.resolveOne(surveyItemResponse, "surveyItem");
  }
}
