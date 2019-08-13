import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Letter,
  LetterElementType,
  LetterUpdateInput
} from "./letter.entities";
import { Repository } from "typeorm";

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>
  ) {}

  createLetter(name: string) {
    const newLetter = this.letterRepository.create({ name });
    return this.letterRepository.save(newLetter);
  }

  letter(id: number) {
    return this.letterRepository.findOne(id);
  }

  letters() {
    return this.letterRepository.find();
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

  deleteLetter(id: number) {
    return this.letterRepository.delete(id);
  }
}

@Injectable()
export class LetterElementTypeService {
  constructor(
    @InjectRepository(LetterElementType)
    private readonly letterElementTypeRepository: Repository<LetterElementType>
  ) {}

  createLetterElementType(key: string, description: string) {
    const newLetterElementType = this.letterElementTypeRepository.create({
      key,
      description
    });
    return this.letterElementTypeRepository.save(newLetterElementType);
  }

  letterElementType(id: number) {
    return this.letterElementTypeRepository.findOne(id);
  }

  letterElementTypes() {
    return this.letterElementTypeRepository.find();
  }

  deleteLetterElementType(id: number) {
    return this.letterElementTypeRepository.delete(id);
  }
}
