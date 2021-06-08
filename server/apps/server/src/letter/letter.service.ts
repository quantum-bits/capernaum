import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Letter,
  LetterElement,
  LetterElementType,
  LetterType,
  LetterTypeCreateInput,
  LetterTypeUpdateInput,
} from "./entities";
import { Repository } from "typeorm";
import { OldBaseService } from "../shared/old-base.service";
import { PredictionTableEntry } from "../prediction/entities";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("letter:service");

@Injectable()
export class LetterService extends OldBaseService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepo: Repository<Letter>,
    @InjectRepository(LetterType)
    private readonly letterTypeRepo: Repository<LetterType>,
    @InjectRepository(LetterElement)
    private readonly letterElementRepo: Repository<LetterElement>,
    @InjectRepository(LetterElementType)
    private readonly letterElementTypeRepo: Repository<LetterElementType>,
    @InjectRepository(PredictionTableEntry)
    private readonly predictionTableEntryRepo: Repository<PredictionTableEntry>
  ) {
    super();
  }

  letter(id: number) {
    return this.letterRepo.findOneOrFail(id, {
      relations: [
        "letterType",
        "letterType.letterElementTypes",
        "letterElements",
        "letterElements.letterElementType",
        "letterElements.image",
        "letterElements.surveyDimension",
      ],
    });
  }

  letterElementTypes() {
    debug("Called letterElementTypes");
    return this.letterElementTypeRepo.find({ order: { description: "ASC" } });
  }

  /**
   * Return elements of letter in sequence order.
   * @param letter
   */
  letterElements(letter: Letter) {
    debug("Called letterElements");
    return this.letterElementRepo.find({
      where: { letter },
      order: { sequence: "ASC" },
    });
  }

  tableEntries(letter: Letter) {
    return this.predictionTableEntryRepo.find({
      where: { letter },
      order: { sequence: "ASC" },
    });
  }
}

@Injectable()
export class LetterTypeService extends OldBaseService {
  constructor(
    @InjectRepository(LetterType)
    private readonly letterTypeRepo: Repository<LetterType>,
    @InjectRepository(LetterElementType)
    private readonly letterElementTypeRepo: Repository<LetterElementType>
  ) {
    super();
  }

  createLetterType(createInput: LetterTypeCreateInput) {
    return this.letterTypeRepo.save(this.letterTypeRepo.create(createInput));
  }

  readLetterTypes() {
    debug("readLetterTypes");
    return this.letterTypeRepo.find({ relations: ["letterElementTypes"] });
  }

  readLetterElementTypes(letterType: LetterType) {
    debug("readLetterElementTypes(%O)", letterType);
    return this.letterElementTypeRepo
      .createQueryBuilder("letterElementType")
      .leftJoinAndSelect("letterElementType.letterTypes", "letterType")
      .where("letterType.id = :id", { id: letterType.id })
      .getMany();
  }

  updateLetterType(updateInput: LetterTypeUpdateInput) {
    return this.letterTypeRepo
      .preload(updateInput)
      .then((result) => this.letterTypeRepo.save(result));
  }

  deleteLetterType(id: number) {
    return this.letterTypeRepo.delete(id).then((result) => result.affected);
  }
}

@Injectable()
export class LetterElementTypeService extends OldBaseService {
  constructor(
    @InjectRepository(LetterType)
    private readonly letterTypeRepo: Repository<LetterType>
  ) {
    super();
  }

  readLetterTypes(letterElementType: LetterElementType) {
    debug("readLetterTypes(%O)", letterElementType);
    return this.letterTypeRepo
      .createQueryBuilder("letterType")
      .leftJoinAndSelect("letterType.letterElementTypes", "letterElementType")
      .where("letterElementType.id = :id", { id: letterElementType.id })
      .getMany();
  }
}
