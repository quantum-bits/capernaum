import { InjectRepository } from "@nestjs/typeorm";
import { Survey, SurveyCreateInput } from "./survey.entities";
import { Repository } from "typeorm";
import { GenericService } from "../generic/generic.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SurveyService extends GenericService<Survey, SurveyCreateInput> {
  constructor(@InjectRepository(Survey) surveyRepository: Repository<Survey>) {
    super(surveyRepository);
  }
}
