import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Group,
  GroupCreateInput,
  GroupUpdateInput,
  Letter,
  LetterElement,
  LetterElementType,
  LetterType,
  LetterTypeCreateInput,
  LetterTypeUpdateInput,
} from "./entities";
import { Repository } from "typeorm";
import { BaseService } from "../shared/base.service";
import { PredictionTableEntry } from "../prediction/entities";

import Debug from "debug";
const debug = Debug("letter:service");

@Injectable()
export class LetterService extends BaseService {
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
    debug("letter(%d)", id);
    const rtn = this.letterRepo
      .createQueryBuilder("letter")
      .leftJoinAndSelect("letter.letterElements", "letterElements")
      .leftJoinAndSelect(
        "letterElements.letterElementType",
        "letterElementType"
      )
      .leftJoinAndSelect("letterElements.image", "images")
      .leftJoinAndSelect("letterElements.surveyDimension", `dimension`)
      .leftJoinAndSelect("letter.letterType", "letterType")
      .leftJoinAndSelect("letterType.letterElementTypes", "letterElementTypes")
      .where("letter.id = :id", { id })
      .orderBy("letterElements.sequence")
      .getOne();
    debug("LETTER %O", rtn);
    return rtn;
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
export class GroupService extends BaseService {
  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>
  ) {
    super();
  }

  createGroup(createInput: GroupCreateInput) {
    return this.groupRepo.save(this.groupRepo.create(createInput));
  }

  readGroups() {
    return this.groupRepo.find();
  }

  updateGroup(updateInput: GroupUpdateInput) {
    return this.groupRepo
      .preload(updateInput)
      .then((result) => this.groupRepo.save(result));
  }
}

@Injectable()
export class LetterTypeService extends BaseService {
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
    return this.letterTypeRepo.find();
  }

  readLetterElementTypes(letterType: LetterType) {
    debug("readLetterElementTypes(%O)", letterType);
    return this.letterTypeRepo.find({
      relations: ["letterElementTypes"],
    });
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
