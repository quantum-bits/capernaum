import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Letter, LetterElementType, LetterUpdateInput } from "./entities";
import { EntityManager, Repository } from "typeorm";
import { BaseService } from "../shared/base.service";

@Injectable()
export class LetterService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
    @InjectRepository(LetterElementType)
    private readonly letterElementTypeRepository: Repository<LetterElementType>
  ) {
    super(entityManager);
  }

  createLetter(name: string) {
    const newLetter = this.letterRepository.create({ name });
    return this.letterRepository.save(newLetter);
  }

  async updateLetter(letterData: LetterUpdateInput) {
    const letter = await this.letterRepository.findOne(letterData.id);
    if (letterData.isFrozen !== undefined) {
      letter.isFrozen = letterData.isFrozen;
    }
    if (letterData.name !== undefined) {
      letter.name = letterData.name;
    }
    return this.letterRepository.save(letter);
  }

  createLetterElementType(key: string, description: string) {
    const newLetterElementType = this.letterElementTypeRepository.create({
      key,
      description
    });
    return this.letterElementTypeRepository.save(newLetterElementType);
  }
}
