import { Injectable } from "@nestjs/common";
import {
  Survey,
  SurveyCreateInput,
  SurveyUpdateInput
} from "./entities/survey";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";

@Injectable()
export class SurveyService extends BaseService<Survey> {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>
  ) {
    super(surveyRepository);
  }

  create(createInput: SurveyCreateInput) {
    const newEntity = this.surveyRepository.create(createInput);
    return this.surveyRepository.save(newEntity);
  }

  async update(updateInput: SurveyUpdateInput & { id: number }) {
    const oldEntity = await this.surveyRepository.findOne(updateInput.id);

    for (let prop of Object.keys(updateInput)) {
      if (prop !== "id") {
        oldEntity[prop] = updateInput[prop];
      }
    }

    return this.surveyRepository.save(oldEntity);
  }
}
