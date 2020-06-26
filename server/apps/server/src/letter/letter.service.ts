import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Letter, LetterElement, LetterElementType } from "./entities";
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

  letter(id: number) {
    return this.letterRepo
      .createQueryBuilder("letter")
      .leftJoinAndSelect("letter.letterElements", "letterElements")
      .leftJoinAndSelect("letterElements.letterElementType", "elementTypes")
      .leftJoinAndSelect("letterElements.image", "images")
      .leftJoinAndSelect("letterElements.surveyDimension", "dimension")
      .where("letter.id = :id", { id })
      .orderBy("letterElements.sequence")
      .getOne();
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
}
