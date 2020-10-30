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
    return this.letterRepo
      .createQueryBuilder("letter")
      .leftJoinAndSelect("letter.letterElements", "letterElements")
      .leftJoinAndSelect("letterElements.letterElementType", "elementTypes")
      .leftJoinAndSelect("letterElements.image", "images")
      .leftJoinAndSelect("letterElements.surveyDimension", `dimension`)
      .leftJoinAndSelect("letter.letterType", "letterType")
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
    private readonly lettertypeRepo: Repository<LetterType>
  ) {
    super();
  }

  createLetterType(createInput: LetterTypeCreateInput) {
    return this.lettertypeRepo.save(this.lettertypeRepo.create(createInput));
  }

  readLetterTypes() {
    return this.lettertypeRepo.find();
  }

  updateLetterType(updateInput: LetterTypeUpdateInput) {
    return this.lettertypeRepo
      .preload(updateInput)
      .then((result) => this.lettertypeRepo.save(result));
  }

  deleteLetterType(id: number) {
    return this.lettertypeRepo.delete(id).then((result) => result.affected);
  }
}
