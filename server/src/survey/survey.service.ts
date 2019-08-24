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
import {
  EntityManager,
  FindConditions,
  ObjectType,
  Repository,
  Transaction
} from "typeorm";
import {
  QualtricsQuestion,
  QualtricsSurvey
} from "../qualtrics/qualtrics.types";
import { assign, pick, difference } from "lodash";
import { BaseEntity } from "../shared/base-entity";

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
    return this.entityManager.transaction(async manager => {
      const surveyDimensionRepo = manager.getRepository(SurveyDimension);
      const surveyIndexRepo = manager.getRepository(SurveyIndex);
      const surveyItemRepo = manager.getRepository(SurveyItem);

      const dimension = await surveyDimensionRepo.findOneOrFail(
        createInput.dimensionId
      );

      const newIndex = await surveyIndexRepo.save(
        surveyIndexRepo.create({
          surveyDimension: dimension,
          title: createInput.title,
          abbreviation: createInput.abbreviation
        })
      );

      for (const itemId of createInput.itemIds) {
        const item = await surveyItemRepo.findOneOrFail(itemId);
        item.surveyIndex = newIndex;
        await surveyItemRepo.save(item);
      }

      return newIndex;
    });
  }

  readAll(entity: ObjectType<BaseEntity>) {
    return this.entityManager.find(entity);
  }

  readOne(entity: ObjectType<BaseEntity>, id: number) {
    return this.entityManager.findOne(entity, id);
  }

  find<Entity>(
    entityClass: ObjectType<Entity>,
    conditions: FindConditions<Entity>
  ) {
    return this.entityManager.find(entityClass, conditions);
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

  // This is a helper method to avoid nested transactions; do not call directly.
  private async _deleteSurveyIndex(
    manager: EntityManager,
    id: number
  ): Promise<SurveyIndexDeleteOutput> {
    const index = await manager.findOneOrFail(SurveyIndex, id, {
      relations: ["surveyItems"]
    });

    // Clear FK references from items to this index.
    const removedItemIds = index.surveyItems.map(item => item.id);
    for (let id of removedItemIds) {
      await manager.update(SurveyItem, id, { surveyIndex: null });
    }

    await manager.remove(SurveyIndex, index);

    return {
      deletedIndexId: id,
      deletedItemIds: removedItemIds
    };
  }

  async deleteSurveyIndex(id: number) {
    return this.entityManager.transaction(async manager =>
      this._deleteSurveyIndex(manager, id)
    );
  }

  async deleteSurveyDimension(
    dimensionId: number
  ): Promise<SurveyDimensionDeleteOutput> {
    return this.entityManager.transaction(async manager => {
      const surveyDimensionRepo = manager.getRepository(SurveyDimension);

      const dimension = await surveyDimensionRepo.findOneOrFail(dimensionId, {
        relations: ["surveyIndices"]
      });

      const dimensionDeleteOutput: SurveyDimensionDeleteOutput = {
        deletedDimensionId: dimensionId,
        deletedIndexIds: [],
        deletedItemIds: []
      };

      for (const index of dimension.surveyIndices) {
        const indexDeleteOutput = await this._deleteSurveyIndex(
          manager,
          index.id
        );
        dimensionDeleteOutput.deletedIndexIds.push(
          indexDeleteOutput.deletedIndexId
        );
        dimensionDeleteOutput.deletedItemIds = dimensionDeleteOutput.deletedItemIds.concat(
          indexDeleteOutput.deletedItemIds
        );
      }

      await surveyDimensionRepo.remove(dimension);

      return dimensionDeleteOutput;
    });
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