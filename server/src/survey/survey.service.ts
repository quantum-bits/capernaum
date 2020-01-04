import { Injectable } from "@nestjs/common";
import {
  Survey,
  SurveyCreateInput,
  SurveyDimension,
  SurveyDimensionCreateInput,
  SurveyDimensionDeleteOutput,
  SurveyIndex,
  SurveyIndexCreateInput,
  SurveyIndexDeleteOutput,
  SurveyIndexUpdateInput,
  SurveyItem,
  SurveyItemResponse,
  SurveyResponse
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, IsNull, Not, Repository } from "typeorm";
import {
  QualtricsQuestion,
  QualtricsSurvey,
  QualtricsSurveyResponse
} from "../qualtrics/qualtrics.types";
import { assign, difference, pick } from "lodash";
import { QualtricsImportedResponse, WhichItems } from "./survey.types";
import { BaseService } from "../shared/base.service";
import debug from "debug";
import { Letter } from "../letter/entities";

const surveyDebug = debug("survey");

@Injectable()
export class SurveyService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Survey)
    private readonly surveyRepo: Repository<Survey>,
    @InjectRepository(SurveyDimension)
    private readonly surveyDimensionRepo: Repository<SurveyDimension>,
    @InjectRepository(SurveyIndex)
    private readonly surveyIndexRepo: Repository<SurveyIndex>,
    @InjectRepository(SurveyItem)
    private readonly surveyItemRepo: Repository<SurveyItem>,
    @InjectRepository(SurveyResponse)
    private readonly surveyResponseRepo: Repository<SurveyResponse>,
    @InjectRepository(SurveyItemResponse)
    private readonly surveyItemResponseRepo: Repository<SurveyItemResponse>
  ) {
    super(entityManager);
  }

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
        createInput.surveyDimensionId
      );

      const newIndex = await surveyIndexRepo.save(
        surveyIndexRepo.create({
          surveyDimension: dimension,
          title: createInput.title,
          abbreviation: createInput.abbreviation,
          useForPredictions: createInput.useForPredictions
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

  surveyResponseComplete(responseId: number) {
    return this.surveyResponseRepo
      .createQueryBuilder("surveyResponse")
      .innerJoinAndSelect("surveyResponse.survey", "survey")
      .innerJoinAndSelect("survey.surveyDimensions", "dimensions")
      .innerJoinAndSelect("dimensions.surveyIndices", "indices")
      .innerJoinAndSelect("indices.surveyItems", "items")
      .innerJoinAndSelect("items.surveyItemResponses", "responseItems")
      .leftJoinAndSelect("indices.predictionTableEntries", "tableEntries")
      .leftJoinAndSelect("tableEntries.practice", "practice")
      .where("surveyResponse.id = :responseId", { responseId })
      .andWhere("responseItems.surveyResponseId = :responseId", {
        responseId
      })
      .getOne();
  }

  surveyResponse(id: number) {
    return this.surveyResponseRepo.findOne(id);
  }

  findItemResponse(surveyItem: SurveyItem, responseId: number) {
    return this.surveyItemResponseRepo.findOne({
      surveyItemId: surveyItem.id,
      surveyResponseId: responseId
    });
  }

  findSurveyByQualtricsId(qualtricsId: string) {
    return this.surveyRepo.findOne({ qualtricsId });
  }

  findLetter(surveyId: number) {
    return this.entityManager.findOne(Letter, {
      surveyId
    });
  }

  findItemsForSurvey(survey: Survey, whichItems: WhichItems) {
    const where = { survey };

    switch (whichItems) {
      case WhichItems.All:
        /* NOP */
        break;
      case WhichItems.WithIndex:
        where["surveyIndexId"] = Not(IsNull());
        break;
      case WhichItems.WithoutIndex:
        where["surveyIndexId"] = IsNull();
        break;
    }

    return this.surveyItemRepo.find({
      where,
      order: { id: "ASC" }
    });
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
      assign(
        index,
        pick(updateInput, ["title", "abbreviation", "useForPredictions"])
      );

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

  async deleteSurvey(id: number) {
    return this.entityManager.transaction(async manager => {
      await manager.delete(SurveyItem, { surveyId: id });
      const deleteResult = await manager.delete(Survey, id);
      return deleteResult.affected;
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

  private async _deleteSurveyResponse(
    manager: EntityManager,
    surveyResponseId: number
  ) {
    // Delete responses to each question.
    await manager.delete(SurveyItemResponse, {
      surveyResponseId
    });

    return manager.delete(SurveyResponse, {
      id: surveyResponseId
    });
  }

  async deleteSurveyResponse(surveyResponseId: number) {
    return this.entityManager.transaction(async manager => {
      const result = await this._deleteSurveyResponse(
        manager,
        surveyResponseId
      );
      return result.affected;
    });
  }

  async importQualtricsSurvey(qualtricsSurvey: QualtricsSurvey) {
    // FIXME: This should use a transaction.
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
      qualtricsId: qualtricsSurvey.id,
      qualtricsName: qualtricsSurvey.name,
      qualtricsModDate: qualtricsSurvey.lastModifiedDate,
      surveyItems: newSurveyItems
    });
    return this.surveyRepo.save(newSurvey);
  }

  /**
   * Import from Qualtrics one respondent's response to a survey.
   * @param surveyId - database survey ID
   * @param createInput - details of the response from Qualtrics
   */
  async importQualtricsSurveyResponse(
    surveyId: number,
    createInput: QualtricsSurveyResponse
  ): Promise<QualtricsImportedResponse> {
    return this.entityManager.transaction(async manager => {
      const surveyResponseRepo = manager.getRepository(SurveyResponse);
      const surveyItemResponseRepo = manager.getRepository(SurveyItemResponse);

      // Check for an existing import of this response using its Qualtrics ID.
      let foundPreviousImport = false;
      const previousImport = await surveyResponseRepo.findOne({
        qualtricsResponseId: createInput.responseId
      });
      if (previousImport) {
        foundPreviousImport = true;
        // We've previously imported this response; toss it and replace it from Qualtrics.
        surveyDebug(
          "Delete previously imported response %s",
          createInput.responseId
        );
        this._deleteSurveyResponse(manager, previousImport.id);
      }

      // Load the survey and its items from the database.
      const survey = await manager.findOneOrFail(Survey, surveyId, {
        relations: ["surveyItems"]
      });

      // Save response metadata to the database.
      const newSurveyResponse = await surveyResponseRepo.save(
        surveyResponseRepo.create({
          survey,
          email: createInput.values["QID2_TEXT"] || "??",
          groupCode: createInput.values["QID3_TEXT"] || "??",
          qualtricsResponseId: createInput.responseId || "??",
          startDate: createInput.values["startDate"] || "??",
          endDate: createInput.values["endDate"] || "??",
          recordedDate: createInput.values["recordedDate"] || "??",
          status: parseInt(createInput.values["status"]) || -1,
          ipAddress: createInput.values["ipAddress"] || "??",
          progress: parseInt(createInput.values["progress"]) || -1,
          duration: parseInt(createInput.values["duration"]) || -1,
          finished: parseInt(createInput.values["finished"]) || -1,
          latitude: createInput.values["locationLatitude"] || "??",
          longitude: createInput.values["locationLongitude"] || "??"
        })
      );

      // Map the qualtrics ID for each question to its database ID.
      // We will only import responses to these questions.
      const qualtricsIdToId = new Map<string, number>(
        survey.surveyItems.map(item => [item.qualtricsId, item.id])
      );

      // Save response for each question to database. Use the above
      // map to avoid inserting any response that doesn't exist in the survey.
      // This may be unnecessarily paranoid.
      for (let [key, value] of Object.entries(createInput.values)) {
        if (key.startsWith("QID") && qualtricsIdToId.has(key)) {
          const label = createInput.labels[key];
          await surveyItemResponseRepo.save(
            surveyItemResponseRepo.create({
              surveyResponse: newSurveyResponse,
              surveyItemId: qualtricsIdToId.get(key),
              label: label,
              value: parseInt(value)
            })
          );
        }
      }

      return {
        isDuplicate: foundPreviousImport,
        surveyResponse: newSurveyResponse
      };
    });
  }
}
