import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Letter,
  LetterElement,
  LetterElementType,
  LetterUpdateInput,
  SurveyLetter,
  SurveyLetterCreateInput
} from "./entities";
import { EntityManager, Repository } from "typeorm";
import { BaseService } from "../shared/base.service";

@Injectable()
export class LetterService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(SurveyLetter)
    private readonly surveyLetterRepo: Repository<SurveyLetter>,
    @InjectRepository(Letter)
    private readonly letterRepo: Repository<Letter>,
    @InjectRepository(LetterElement)
    private readonly letterElementRepo: Repository<LetterElement>,
    @InjectRepository(LetterElementType)
    private readonly letterElementTypeRepo: Repository<LetterElementType>
  ) {
    super(entityManager);
  }

  createSurveyLetter(createInput: SurveyLetterCreateInput) {
    return this.surveyLetterRepo.save(
      this.surveyLetterRepo.create(createInput)
    );
  }

  createLetter(name: string) {
    const newLetter = this.letterRepo.create({ name });
    return this.letterRepo.save(newLetter);
  }

  letterElementTypes() {
    return this.letterElementTypeRepo.find({ order: { description: "ASC" } });
  }

  /**
   * Return elements of letter in sequence order.
   * @param letter
   */
  letterElements(letter: Letter) {
    return this.letterElementRepo.find({
      where: { letter },
      order: { sequence: "ASC" }
    });
  }

  async updateLetter(letterData: LetterUpdateInput) {
    const letter = await this.letterRepo.findOne(letterData.id);
    if (letterData.isFrozen !== undefined) {
      letter.isFrozen = letterData.isFrozen;
    }
    if (letterData.name !== undefined) {
      letter.name = letterData.name;
    }
    return this.letterRepo.save(letter);
  }

  createLetterElementType(key: string, description: string) {
    const newLetterElementType = this.letterElementTypeRepo.create({
      key,
      description
    });
    return this.letterElementTypeRepo.save(newLetterElementType);
  }
}
