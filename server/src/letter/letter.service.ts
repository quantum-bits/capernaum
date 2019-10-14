import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Letter,
  LetterElement,
  LetterElementType,
  LetterUpdateInput
} from "./entities";
import { EntityManager, Repository } from "typeorm";
import { BaseService } from "../shared/base.service";
import { PredictionTableEntry } from "../prediction/entities";

@Injectable()
export class LetterService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Letter)
    private readonly letterRepo: Repository<Letter>,
    @InjectRepository(LetterElement)
    private readonly letterElementRepo: Repository<LetterElement>,
    @InjectRepository(LetterElementType)
    private readonly letterElementTypeRepo: Repository<LetterElementType>,
    @InjectRepository(PredictionTableEntry)
    private readonly predictionTableEntryRepo: Repository<PredictionTableEntry>
  ) {
    super(entityManager);
  }

  createLetter(title: string) {
    const newLetter = this.letterRepo.create({ title });
    return this.letterRepo.save(newLetter);
  }

  letter(id: number) {
    return this.letterRepo.findOneOrFail(id, {
      relations: ["letterElements", "letterElements.letterElementType"],
    });
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

  tableEntries(letter: Letter) {
    return this.predictionTableEntryRepo.find({
      where: { letter },
      order: { sequence: "ASC" }
    });
  }

  createLetterElementType(key: string, description: string) {
    return this.letterElementTypeRepo.save(
      this.letterElementTypeRepo.create({
        key,
        description
      })
    );
  }
}
