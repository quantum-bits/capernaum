import { Injectable } from "@nestjs/common";
import {
  Survey,
  SurveyCreateInput,
  SurveyItem,
  SurveyUpdateInput
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";

@Injectable()
export class SurveyService extends BaseService<Survey> {
  constructor(
    @InjectRepository(Survey)
    private readonly repository: Repository<Survey>
  ) {
    super(repository);
  }

  create(createInput: SurveyCreateInput) {
    const newEntity = this.repository.create(createInput);
    return this.repository.save(newEntity);
  }

  async update(updateInput: SurveyUpdateInput & { id: number }) {
    const oldEntity = await this.repository.findOne(updateInput.id);

    for (let prop of Object.keys(updateInput)) {
      if (prop !== "id") {
        oldEntity[prop] = updateInput[prop];
      }
    }

    return this.repository.save(oldEntity);
  }
}

@Injectable()
export class SurveyItemService extends BaseService<SurveyItem> {
  constructor(
    @InjectRepository(SurveyItem)
    private readonly surveyItemRepository: Repository<SurveyItem>
  ) {
    super(surveyItemRepository);
  }

  readBySurvey(survey: Survey) {
    console.log("SURVEY 2", survey);
    return this.surveyItemRepository.find({ survey: survey });
  }
}
