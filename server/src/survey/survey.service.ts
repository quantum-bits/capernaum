import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Survey } from "./survey.entities";
import { Repository } from "typeorm";

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>
  ) {}

  createSurvey(qualtricsId: string, title: string) {
    const newSurvey = this.surveyRepository.create({ qualtricsId, title });
    return this.surveyRepository.save(newSurvey);
  }

  survey(id: number) {
    return this.surveyRepository.findOne(id);
  }

  surveys() {
    return this.surveyRepository.find();
  }

  deleteSurvey(id: number) {
    return this.surveyRepository.delete(id);
  }
}
