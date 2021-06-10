import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  SurveyLetter,
  SurveyLetterCreateInput,
  SurveyLetterUpdateInput,
} from "@server/src/survey/entities";
import { Repository } from "typeorm";
import { BaseService } from "@server/src/shared/base.service";

@Injectable()
export class SurveyLetterService extends BaseService<SurveyLetter> {
  constructor(
    @InjectRepository(SurveyLetter)
    private readonly repo: Repository<SurveyLetter>
  ) {
    super(repo);
  }

  create(createInput: SurveyLetterCreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  readAll() {
    return this.repo.find();
  }

  update(updateInput: SurveyLetterUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  delete(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}
