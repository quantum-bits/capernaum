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
import * as _ from "lodash";

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
    "surveyLetters",
    "surveyLetters.letterType",
    "surveyLetters.letterType.letterElementTypes",
    "surveyLetters.survey",
    "letterElements",
    "letterElements.letterElementType",
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

  readOne(id: number) {
    return this.repo.findOneOrFail(id);
  }

  resolveLetterTypes(letterElementType: LetterElementType) {
    return this.resolveMany(letterElementType, "letterTypes");
  }
}

@Injectable()
export class LetterElementService extends BaseService<LetterElement> {
  constructor(
    private readonly letterService: LetterService,
    private readonly letterElementTypeService: LetterElementTypeService,
    @InjectRepository(LetterElement)
    private readonly repo: Repository<LetterElement>
  ) {
    super(repo);
  }

  async create(createInput: LetterElementCreateInput) {
    const letter = await this.letterService.readOne(createInput.letterId);
    const letterElementType = await this.letterElementTypeService.readOne(
      createInput.letterElementTypeId
    );
    const newLetterElement = await this.repo.save(
      this.repo.create({
        letter,
        letterElementType,
        sequence: createInput.sequence,
      })
    );
    console.log("NEW ELT", createInput, newLetterElement);

    return this.repo.findOneOrFail(newLetterElement.id, {
      relations: ["letterElementType"],
    });
  }

  update(updateInput: LetterElementUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  /**
   * Resequence letter elements with the given IDs. Set their sequence numbers
   * to their position (index) in the array, save in the DB, and return the
   * updated letter elements.
   * @param letterElementIds array of letter element IDs in the desired order
   */
  async resequence(letterElementIds: number[]) {
    function debugLetterElements(msge, letterElements) {
      debug(
        `${msge} %O`,
        _.map(letterElements, (elt) => _.pick(elt, ["id", "sequence"]))
      );
    }

    // Create a map of the new index of each letter element.
    const letterElementIdToNewIndex = new Map<number, number>(
      _.map(letterElementIds, (id, idx) => [id, idx])
    );
    debug("map %o", letterElementIdToNewIndex);

    // Get the letter elements.
    const letterElements = await this.repo.findByIds(letterElementIds);
    debugLetterElements("from database", letterElements);

    // Resequence the letter elements.
    _.forEach(letterElements, (elt) => {
      elt.sequence = letterElementIdToNewIndex.get(elt.id);
    });
    debugLetterElements("resequenced", letterElements);

    // Save the resequenced elements to the database.
    await this.repo.save(letterElements);

    // Fetch with additional relations to make client happier.
    return this.repo.findByIds(letterElementIds, {
      relations: ["letterElementType"],
    });
  }

  delete(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }

  resolveRelatedImage(letterElement: LetterElement): Image {
    return this.resolveOne(letterElement, "image");
  }

  resolveRelatedSurveyDimension(letterElement: LetterElement): SurveyDimension {
    return this.resolveOne(letterElement, "surveyDimension");
  }
}
