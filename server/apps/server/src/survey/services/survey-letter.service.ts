import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import {
  Survey,
  SurveyLetter,
  SurveyLetterCreateInput,
} from "@server/src/survey/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Letter, LetterType } from "@server/src/letter/entities";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("survey-letter");

@Injectable()
export class SurveyLetterService extends BaseService<SurveyLetter> {
  constructor(
    @InjectRepository(SurveyLetter)
    private readonly repo: Repository<SurveyLetter>
  ) {
    super(repo);
  }

  private alwaysRelate = {
    survey: {
      surveyDimensions: {
        surveyIndices: true,
      },
    },
    letter: {
      letterElements: {
        letterElementType: true,
      },
    },
    letterType: true,
  };

  async create(createInput: SurveyLetterCreateInput) {
    debug("create %O", createInput);
    return this.repo.manager.transaction(async (manager) => {
      const surveyRepo = manager.getRepository(Survey);
      const letterTypeRepo = manager.getRepository(LetterType);
      const letterRepo = manager.getRepository(Letter);
      const surveyLetterRepo = manager.getRepository(SurveyLetter); // Can't use `this.repo` because transaction.

      const survey = await surveyRepo.findOneByOrFail({
        id: createInput.surveyId,
      });
      debug("surveyLetter.create/%O", survey);

      const letterType = await letterTypeRepo.findOneByOrFail({
        id: createInput.letterTypeId,
      });
      debug("surveyLetter.create/%O", letterType);

      const letter = await letterRepo.save(
        letterRepo.create({
          title: "",
          description: "",
          emailMessage: "",
        })
      );
      debug("surveyLetter.create/%O", letter);

      const surveyLetter = await surveyLetterRepo.save(
        surveyLetterRepo.create({
          survey,
          letter,
          letterType,
        })
      );
      debug("surveyLetter.create/%O", surveyLetter);

      // Return the full survey letter.
      const result = await surveyLetterRepo.findOneOrFail({
        where: { id: surveyLetter.id },
        relations: this.alwaysRelate,
      });
      debug("surveyLetter.create result/%O", result);
      return result;
    });
  }

  readOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: this.alwaysRelate,
    });
  }

  readAll() {
    return this.repo.find({
      relations: this.alwaysRelate,
    });
  }
}
