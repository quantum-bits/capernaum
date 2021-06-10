import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  SurveyLetter,
  SurveyLetterCreateInput,
  SurveyLetterUpdateInput,
} from "@server/src/survey/entities";
import { Repository } from "typeorm";
import { BaseService } from "@server/src/shared/base.service";
import { SurveyService } from "@server/src/survey/services/survey.service";
import {
  LetterService,
  LetterTypeService,
} from "@server/src/letter/letter.service";

@Injectable()
export class SurveyLetterService extends BaseService<SurveyLetter> {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly letterService: LetterService,
    private readonly letterTypeService: LetterTypeService,
    @InjectRepository(SurveyLetter)
    private readonly repo: Repository<SurveyLetter>
  ) {
    super(repo);
  }

  async create(createInput: SurveyLetterCreateInput) {
    this.repo.create({
      survey: await this.surveyService.readOne(createInput.surveyId),
      letter: await this.letterService.readOne(createInput.letterId),
      letterType: await this.letterTypeService.readOne(createInput.letterId),
    });
  }

  readOne(id) {
    return this.repo.findOne(id);
  }

  readAll() {
    return this.repo.find();
  }

  async update(updateInput: SurveyLetterUpdateInput) {
    const partialEntity: Partial<SurveyLetter> = {};

    async function helper(entityName: string, service) {
      const idField = entityName + "Id";
      if (updateInput[idField]) {
        partialEntity[entityName] = await service.readOne(updateInput[idField]);
      }
    }

    await helper("survey", this.surveyService);
    await helper("letter", this.letterService);
    await helper("letterType", this.letterTypeService);

    return this.repo.update(updateInput.id, partialEntity);
  }

  delete(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}
