import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Letter,
  LetterCreateInput,
  LetterElement,
  LetterElementType,
  LetterElementUpdateInput,
  LetterType,
  LetterTypeCreateInput,
  LetterTypeUpdateInput,
  LetterUpdateInput,
} from "./entities";
import { Repository } from "typeorm";
import { getDebugger } from "@helpers/debug-factory";
import { BaseService } from "@server/src/shared/base.service";

const debug = getDebugger("letter:service");

@Injectable()
export class LetterService extends BaseService<Letter> {
  constructor(
    @InjectRepository(Letter)
    private readonly repo: Repository<Letter>
  ) {
    super(repo);
  }

  construct(createInput: LetterCreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  private alwaysResolve = [
    "letterType",
    "letterType.letterElementTypes",
    "letterElements",
    "letterElements.letterElementType",
  ];

  readAll() {
    this.repo.find({ relations: this.alwaysResolve });
  }

  readOne(id: number) {
    return this.repo.findOne(id, {
      relations: [
        ...this.alwaysResolve,
        "letterElements.textDelta",
        "letterElements.image",
        "letterElements.surveyDimension",
        "letterElements.predictionTable",
      ],
    });
  }

  resolveRelatedSurvey(letter: Letter) {
    return this.resolveOne(letter, "survey");
  }

  update(updateInput: LetterUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  delete(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}

@Injectable()
export class LetterTypeService extends BaseService<LetterType> {
  constructor(
    @InjectRepository(LetterType)
    private readonly repo: Repository<LetterType>
  ) {
    super(repo);
  }

  construct(createInput: LetterTypeCreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  readOne(id: number) {
    return this.repo.findOne(id);
  }

  readAll() {
    return this.repo.find({ relations: ["letterElementTypes"] });
  }

  update(updateInput: LetterTypeUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  deconstruct(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}

@Injectable()
export class LetterElementService extends BaseService<LetterElement> {
  constructor(
    @InjectRepository(LetterElement)
    private readonly letterElementRepo: Repository<LetterElement>
  ) {
    super(letterElementRepo);
  }

  update(updateInput: LetterElementUpdateInput) {
    return this.letterElementRepo
      .preload(updateInput)
      .then((result) => this.letterElementRepo.save(result));
  }

  deconstruct(id: number) {
    return this.letterElementRepo.delete(id).then((result) => result.affected);
  }

  resolveRelatedImage(letterElement: LetterElement) {
    return this.resolveOne(letterElement, "image");
  }

  resolveRelatedSurveyDimension(letterElement: LetterElement) {
    return this.resolveOne(letterElement, "surveyDimension");
  }

  resolveRelatedPredictionTable(letterElement: LetterElement) {
    return this.resolveOne(letterElement, "predictionTable");
  }
}

@Injectable()
export class LetterElementTypeService extends BaseService<LetterElementType> {
  constructor(
    @InjectRepository(LetterElementType)
    private readonly repo: Repository<LetterElementType>
  ) {
    super(repo);
  }

  readAll() {
    return this.repo.find({ order: { description: "ASC" } });
  }

  resolveLetterTypes(letterElementType: LetterElementType) {
    return this.resolveMany(letterElementType, "letterTypes");
  }
}
