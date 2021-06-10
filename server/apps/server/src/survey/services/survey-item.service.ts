import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SurveyItem } from "../entities";

@Injectable()
export class SurveyItemService extends BaseService<SurveyItem> {
  constructor(
    @InjectRepository(SurveyItem)
    private readonly repo: Repository<SurveyItem>
  ) {
    super(repo);
  }

  readAll() {
    return this.repo.find();
  }

  resolveRelatedSurveyIndex(surveyItem: SurveyItem) {
    return super.resolveOne(surveyItem, "surveyIndex");
  }

  resolveRelatedSurveyItemResponses(surveyItem: SurveyItem) {
    return super.resolveMany(surveyItem, "surveyItemResponses");
  }
}
