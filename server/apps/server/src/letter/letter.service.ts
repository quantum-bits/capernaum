import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Letter,
  LetterCreateInput,
  LetterElement,
  LetterElementCreateInput,
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
import { SurveyDimension } from "@server/src/survey/entities";
import { Image } from "@server/src/image/entities";

const debug = getDebugger("letter");

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
    "surveys",
  ];

  readAll() {
    return this.repo.find({ relations: this.alwaysResolve });
  }

  readOne(id: number) {
    return this.repo.findOne(id, {
      relations: [
        ...this.alwaysResolve,
        "letterElements.image",
        "letterElements.surveyDimension",
      ],
    });
  }

  async findForSurvey(surveyId: number, respondentType: string) {
    debug("Find %s letter for survey %s", respondentType, surveyId);

    const letters = await this.repo
      .createQueryBuilder("letter")
      .innerJoinAndSelect("letter.letterType", "letterType")
      .innerJoinAndSelect("letter.surveys", "survey")
      .where("letterType.key = :type", { type: respondentType })
      .getMany();
    debug("Fetched %O", letters);

    if (letters.length !== 1) {
      throw Error(`Expected 1 letter, found ${letters.length}`);
    }
    return letters[0];
  }

  resolveRelatedSurveys(letter: Letter) {
    return this.resolveMany(letter, "surveys");
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

  delete(id: number) {
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

  create(createInput: LetterElementCreateInput) {
    return this.letterElementRepo.create(createInput);
  }

  update(updateInput: LetterElementUpdateInput) {
    return this.letterElementRepo
      .preload(updateInput)
      .then((result) => this.letterElementRepo.save(result));
  }

  delete(id: number) {
    return this.letterElementRepo.delete(id).then((result) => result.affected);
  }

  resolveRelatedImage(letterElement: LetterElement): Image {
    return this.resolveOne(letterElement, "image");
  }

  resolveRelatedSurveyDimension(letterElement: LetterElement): SurveyDimension {
    return this.resolveOne(letterElement, "surveyDimension");
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
