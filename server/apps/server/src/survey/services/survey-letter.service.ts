import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import { SurveyLetter } from "@server/src/survey/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SurveyLetterService extends BaseService<SurveyLetter> {
  constructor(
    @InjectRepository(SurveyLetter)
    private readonly repo: Repository<SurveyLetter>
  ) {
    super(repo);
  }

  private alwaysRelate = ["survey", "letter", "letterType"];

  readAll() {
    return this.repo.find({ relations: this.alwaysRelate });
  }
}
