import { Injectable } from "@nestjs/common";
import {
  QualtricsImportInput,
  Survey,
  SurveyCreateInput,
  SurveyDimension,
  SurveyDimensionCreateInput,
  SurveyDimensionDeleteOutput,
  SurveyDimensionUpdateInput,
  SurveyIndex,
  SurveyIndexCreateInput,
  SurveyIndexDeleteOutput,
  SurveyIndexUpdateInput,
  SurveyItem,
  SurveyUpdateInput
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, Transaction } from "typeorm";
import {
  QualtricsQuestion,
  QualtricsSurvey
} from "../qualtrics/qualtrics.types";
import { assign, pick, difference } from "lodash";

@Injectable()
export class SurveyService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Survey)
    private readonly surveyRepo: Repository<Survey>,
    @InjectRepository(SurveyDimension)
    private readonly surveyDimensionRepo: Repository<SurveyDimension>,
    @InjectRepository(SurveyIndex)
    private readonly surveyIndexRepo: Repository<SurveyIndex>,
    @InjectRepository(SurveyItem)
    private readonly surveyItemRepo: Repository<SurveyItem>
  ) {}

  createSurvey(createInput: SurveyCreateInput) {
    return this.surveyRepo.save(this.surveyRepo.create(createInput));
  }

  async createDimension(createInput: SurveyDimensionCreateInput) {
    const survey = await this.surveyRepo.findOneOrFail(createInput.surveyId);
    return this.surveyDimensionRepo.save(
      this.surveyDimensionRepo.create({
        survey,
        title: createInput.title,
        sequence: createInput.sequence
      })
    );
  }

  async createIndex(createInput: SurveyIndexCreateInput) {
    const dimension = await this.surveyDimensionRepo.findOneOrFail(
      createInput.dimensionId
    );

    const newIndex = await this.surveyIndexRepo.save(
      this.surveyIndexRepo.create({
        surveyDimension: dimension,
        title: createInput.title,
        abbreviation: createInput.abbreviation
      })
    );

    for (const itemId of createInput.itemIds) {
      const item = await this.surveyItemRepo.findOneOrFail(itemId);
      item.surveyIndex = newIndex;
      await this.surveyItemRepo.save(item);
    }

    return newIndex;
  }

  readAllSurveys() {
    return this.surveyRepo.find();
  }

  readAllSurveyDimensions() {
    return this.surveyDimensionRepo.find();
  }

  readAllSurveyIndices() {
    return this.surveyIndexRepo.find();
  }

  readOneSurvey(id: number) {
    return this.surveyRepo.findOne(id);
  }

  findItemsForSurvey(survey: Survey) {
    return this.surveyItemRepo.find({ survey });
  }

  findDimensionsForSurvey(survey: Survey) {
    return this.surveyDimensionRepo.find({ survey });
  }

  findIndicesForDimension(surveyDimension: SurveyDimension) {
    return this.surveyIndexRepo.find({ surveyDimension });
  }

  findItemsForIndex(surveyIndex: SurveyIndex) {
    return this.surveyItemRepo.find({ surveyIndex });
  }

  async updateSurvey(updateInput: SurveyUpdateInput) {
    const preload = await this.surveyRepo.preload(updateInput);
    return this.surveyRepo.save(preload);
  }

  async updateSurveyDimension(updateInput: SurveyDimensionUpdateInput) {
    const preload = await this.surveyDimensionRepo.preload(updateInput);
    return this.surveyDimensionRepo.save(preload);
  }

  updateSurveyIndex(updateInput: SurveyIndexUpdateInput) {
    return this.entityManager.transaction(async manager => {
      // N.B., can also use the manager directly.
      const surveyIndexRepo = manager.getRepository(SurveyIndex);
      const surveyItemRepo = manager.getRepository(SurveyItem);

      const index = await surveyIndexRepo.findOneOrFail(updateInput.id, {
        relations: ["surveyItems"]
      });

      // Assign scalar updates, if any. Only those props listed will be updated,
      // and then only if present in updateInput.
      assign(index, pick(updateInput, ["title", "abbreviation"]));

      // Fetch survey items specified by the update.
      const updateItems = await surveyItemRepo.findByIds(updateInput.itemIds);
      const validUpdateItemIds = updateItems.map(item => item.id);

      // Check that all specified items actually exist.
      const bogusItemIds = difference(updateInput.itemIds, validUpdateItemIds);
      console.log(
        `UPDATE ${updateInput.itemIds} VALID ${validUpdateItemIds} BOGUS ${bogusItemIds}`
      );
      if (bogusItemIds.length > 0) {
        throw new Error(
          `Survey items with these IDs don't exist: ${bogusItemIds
            .sort()
            .join(", ")}`
        );
      }

      // Update the list of survey items.
      index.surveyItems = updateItems;

      // Save changes to database.
      //   (+) Simple, obvious, and wraps everything in a transaction
      //   (-) Much less efficient than a handcrafted query (or QueryBuilder).
      return surveyIndexRepo.save(index);
    });
  }

  async deleteSurveyDimension(
    dimensionId: number
  ): Promise<SurveyDimensionDeleteOutput> {
    const dimension = await this.surveyDimensionRepo.findOneOrFail(
      dimensionId,
      { relations: ["surveyIndices"] }
    );

    const dimensionDeleteOutput: SurveyDimensionDeleteOutput = {
      deletedDimensionId: dimensionId,
      deletedIndexIds: [],
      deletedItemIds: []
    };

    for (const index of dimension.surveyIndices) {
      const indexDeleteOutput = await this.deleteSurveyIndex(index.id);
      dimensionDeleteOutput.deletedIndexIds.push(
        indexDeleteOutput.deletedIndexId
      );
      dimensionDeleteOutput.deletedItemIds = dimensionDeleteOutput.deletedItemIds.concat(
        indexDeleteOutput.deletedItemIds
      );
    }

    await this.surveyDimensionRepo.remove(dimension);

    return dimensionDeleteOutput;
  }

  async deleteSurveyIndex(id: number): Promise<SurveyIndexDeleteOutput> {
    const index = await this.surveyIndexRepo.findOneOrFail(id, {
      relations: ["surveyItems"]
    });

    // Clear FK references from items to this index.
    const removedItemIds = index.surveyItems.map(item => item.id);
    for (let id of removedItemIds) {
      await this.surveyItemRepo.update(id, { surveyIndex: null });
    }

    await this.surveyIndexRepo.remove(index);

    return {
      deletedIndexId: id,
      deletedItemIds: removedItemIds
    };
  }

  private static dumpQualtricsQuestion(
    questionId: string,
    question: QualtricsQuestion
  ) {
    console.log(
      `${questionId} - ${JSON.stringify(question.questionType)} - ${
        question.questionText
      }`
    );
  }

  async importQualtricsSurvey(
    qualtricsImportInput: QualtricsImportInput,
    qualtricsSurvey: QualtricsSurvey
  ) {
    // Create a list of survey items.
    const newSurveyItems: SurveyItem[] = [];
    for (let [questionId, question] of Object.entries(
      qualtricsSurvey.questions
    )) {
      if (
        question.questionType.type === "MC" &&
        question.choices &&
        Object.keys(question.choices).length == 7
      ) {
        // Looks like a valid survey question.
        newSurveyItems.push(
          this.surveyItemRepo.create({
            qualtricsId: questionId,
            qualtricsText: question.questionText.trim()
          })
        );
      }
    }
    await this.surveyItemRepo.save(newSurveyItems);

    // Construct the survey.
    const newSurvey = this.surveyRepo.create({
      title: qualtricsImportInput.title,
      qualtricsId: qualtricsSurvey.id,
      qualtricsName: qualtricsSurvey.name,
      qualtricsModDate: qualtricsSurvey.lastModifiedDate,
      surveyItems: newSurveyItems
    });
    return this.surveyRepo.save(newSurvey);
  }
}
