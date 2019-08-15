import { Injectable } from "@nestjs/common";
import {
  Survey,
  SurveyCreateInput,
  SurveyUpdateInput
} from "./survey.entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../base/base.service";

@Injectable()
export class SurveyService extends BaseService<
  Survey,
  SurveyCreateInput,
  SurveyUpdateInput
> {
  constructor(@InjectRepository(Survey) surveyRepository: Repository<Survey>) {
    super(surveyRepository);
  }
}
