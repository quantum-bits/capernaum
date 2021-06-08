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
  SurveyLetter,
  SurveyLetterCreateInput,
  SurveyLetterUpdateInput,
  SurveyResponse,
  SurveyUpdateInput,
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import {
  EntityManager,
  FindConditions,
  IsNull,
  Not,
  Repository,
} from "typeorm";
import {
  QualtricsSurvey,
  QualtricsSurveyResponse,
} from "@qapi/qualtrics-api.types";
import { assign, difference, pick } from "lodash";
import { QualtricsImportedResponse, WhichItems } from "./survey.types";
import { OldBaseService } from "../shared/old-base.service";
import { Letter } from "@server/src/letter/entities";
import { getDebugger } from "@helpers/debug-factory";
import { GroupService } from "@server/src/group/group.service";
import { BaseService } from "@server/src/shared/base.service";

const debug = getDebugger("survey");

@Injectable()
export class SurveyService extends OldBaseService {
  constructor(
    private readonly groupService: GroupService,

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
    super();
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
        sequence: createInput.sequence,
      })
    );
  }

  async createIndex(createInput: SurveyIndexCreateInput) {
    return this.entityManager.transaction(async (manager) => {
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
          useForPredictions: createInput.useForPredictions,
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
    debug("get complete response %d", responseId);

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
        responseId,
      })
      .getOne();
  }

  surveyResponse(id: number) {
    return this.surveyResponseRepo.findOne(id);
  }

  readSurvey(id: number) {
    return this.surveyRepo.findOne(id);
  }

  readSurveyResponses(groupId?: number) {
    const conditions: FindConditions<SurveyResponse> = {};
    if (groupId) {
      conditions.groupId = groupId;
    }

    return this.surveyResponseRepo.find(conditions);
  }

  findItemResponse(surveyItem: SurveyItem, responseId: number) {
    return this.surveyItemResponseRepo.findOne({
      surveyItemId: surveyItem.id,
      surveyResponseId: responseId,
    });
  }

  findSurveyByQualtricsId(qualtricsId: string): Promise<Survey> {
    return this.surveyRepo.findOne(
      { qualtricsId },
      { relations: ["surveyItems"] }
    );
  }

  findLetter(surveyId: number): Promise<Letter> {
    return this.entityManager.findOne(Letter, {
      surveyId,
    });
  }

  findItemsForSurvey(
    survey: Survey,
    whichItems: WhichItems
  ): Promise<SurveyItem[]> {
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
      order: { id: "ASC" },
    });
  }

  updateSurvey(updateInput: SurveyUpdateInput) {
    return this.update(Survey, updateInput);
  }

  updateSurveyIndex(updateInput: SurveyIndexUpdateInput): Promise<SurveyIndex> {
    return this.entityManager.transaction(async (manager) => {
      // N.B., can also use the manager directly.
      const surveyIndexRepo = manager.getRepository(SurveyIndex);
      const surveyItemRepo = manager.getRepository(SurveyItem);

      const index = await surveyIndexRepo.findOneOrFail(updateInput.id, {
        relations: ["surveyItems"],
      });

      // Assign scalar updates, if any. Only those props listed will be updated,
      // and then only if present in updateInput.
      assign(
        index,
        pick(updateInput, ["title", "abbreviation", "useForPredictions"])
      );

      // Fetch survey items specified by the update.
      const updateItems = await surveyItemRepo.findByIds(updateInput.itemIds);
      const validUpdateItemIds = updateItems.map((item) => item.id);

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
    return this.entityManager.transaction(async (manager) => {
      await manager.delete(SurveyItem, { surveyId: id });
      const deleteResult = await manager.delete(Survey, id);
      return deleteResult.affected;
    });
  }

  // Helper method to avoid nested transactions; do not call directly.
  private static async _deleteSurveyIndex(
    manager: EntityManager,
    id: number
  ): Promise<SurveyIndexDeleteOutput> {
    const index = await manager.findOneOrFail(SurveyIndex, id, {
      relations: ["surveyItems"],
    });

    // Clear FK references from items to this index.
    const removedItemIds = index.surveyItems.map((item) => item.id);
    for (const id of removedItemIds) {
      await manager.update(SurveyItem, id, { surveyIndex: null });
    }

    await manager.remove(SurveyIndex, index);

    return {
      deletedIndexId: id,
      deletedItemIds: removedItemIds,
    };
  }

  async deleteSurveyIndex(id: number) {
    return this.entityManager.transaction(async (manager) =>
      SurveyService._deleteSurveyIndex(manager, id)
    );
  }

  async deleteSurveyDimension(
    dimensionId: number
  ): Promise<SurveyDimensionDeleteOutput> {
    return this.entityManager.transaction(async (manager) => {
      const surveyDimensionRepo = manager.getRepository(SurveyDimension);

      const dimension = await surveyDimensionRepo.findOneOrFail(dimensionId, {
        relations: ["surveyIndices"],
      });

      const dimensionDeleteOutput: SurveyDimensionDeleteOutput = {
        deletedDimensionId: dimensionId,
        deletedIndexIds: [],
        deletedItemIds: [],
      };

      for (const index of dimension.surveyIndices) {
        const indexDeleteOutput = await SurveyService._deleteSurveyIndex(
          manager,
          index.id
        );
        dimensionDeleteOutput.deletedIndexIds.push(
          indexDeleteOutput.deletedIndexId
        );
        dimensionDeleteOutput.deletedItemIds =
          dimensionDeleteOutput.deletedItemIds.concat(
            indexDeleteOutput.deletedItemIds
          );
      }

      await surveyDimensionRepo.remove(dimension);

      return dimensionDeleteOutput;
    });
  }

  // private static dumpQualtricsQuestion(
  //   questionId: string,
  //   question: QualtricsQuestion
  // ) {
  //   console.log(
  //     `${questionId} - ${JSON.stringify(question.questionType)} - ${
  //       question.questionText
  //     }`
  //   );
  // }

  private static async _deleteSurveyResponse(
    manager: EntityManager,
    surveyResponseId: number
  ) {
    // Delete responses to each question.
    await manager.delete(SurveyItemResponse, {
      surveyResponseId,
    });

    return manager.delete(SurveyResponse, {
      id: surveyResponseId,
    });
  }

  async deleteSurveyResponse(surveyResponseId: number) {
    return this.entityManager.transaction(async (manager) => {
      const result = await SurveyService._deleteSurveyResponse(
        manager,
        surveyResponseId
      );
      return result.affected;
    });
  }

  /**
   * Import details from a Qualtrics survey into Capernaum. Normally called
   * from `importQualtricsSurvey` in the Qualtrics resolver.
   *
   * @param qualtricsSurvey Data fetched from Qualtrics.
   */
  async importQualtricsSurvey(
    qualtricsSurvey: QualtricsSurvey
  ): Promise<Survey> {
    // surveyDebug("QualtricsSurvey %O", qualtricsSurvey);

    return this.entityManager.transaction(async (manager) => {
      const surveyItemRepo = manager.getRepository(SurveyItem);
      const surveyRepo = manager.getRepository(Survey);

      // Check whether we already have imported the survey.
      let workingSurvey = await this.findSurveyByQualtricsId(
        qualtricsSurvey.id
      );

      if (!workingSurvey) {
        // Haven't imported this survey. Create a new one.
        debug("Survey not in database; creating new one");
        workingSurvey = surveyRepo.create({
          qualtricsId: qualtricsSurvey.id,
          qualtricsName: qualtricsSurvey.name,
          qualtricsModDate: qualtricsSurvey.lastModifiedDate,
          surveyItems: [],
        });
      } else {
        debug(`Survey '${qualtricsSurvey.id}' already in database; updating`);
        workingSurvey.qualtricsName = qualtricsSurvey.name;
        workingSurvey.qualtricsModDate = qualtricsSurvey.lastModifiedDate;
      }

      // Create or update questions for this survey.
      for (const [qualtricsId, question] of Object.entries(
        qualtricsSurvey.questions
      )) {
        if (question.questionType.type === "TE") {
          // This question asks for text input. The only ones we care about here are
          // the ones for the questions having a Qualtrics name of "EMAIL" or "GROUP_CODE".
          debug("Found a text question %O", question);
          const responseKey = `${qualtricsId}_TEXT`;
          if (question.questionName === "EMAIL") {
            workingSurvey.emailKey = responseKey;
            debug(`Found the EMAIL question - '${responseKey}'`);
          } else if (question.questionName === "GROUP_CODE") {
            workingSurvey.groupCodeKey = responseKey;
            debug(`Found the GROUP_CODE question - '${responseKey}'`);
          } else {
            debug("Ignoring this text question");
          }
        } else if (
          question.questionType.type === "MC" &&
          question.choices &&
          Object.keys(question.choices).length == 7
        ) {
          // This question is a multiple choice question with seven choices.
          // Consider it one of the main survey questions and import it.
          debug("Handling question %s", qualtricsId);
          const trimmedQuestionText = question.questionText.trim();

          // See if we've already imported it.
          const existingItem = workingSurvey.findItem(qualtricsId);
          if (existingItem) {
            // Already have this question; update it.
            debug(`Update existing question to '${trimmedQuestionText}'`);
            existingItem.qualtricsText = trimmedQuestionText;
            existingItem.qualtricsName = question.questionName;
            await surveyItemRepo.save(existingItem);
          } else {
            // New question; create it.
            debug(`Add new question ${qualtricsId} - ${trimmedQuestionText}`);
            const newItem = surveyItemRepo.create({
              qualtricsId,
              qualtricsText: trimmedQuestionText,
              qualtricsName: question.questionName,
            });
            await surveyItemRepo.save(newItem);
            workingSurvey.surveyItems.push(newItem);
          }
        }
      }

      // Save everything to the database.
      debug("Save to the database");
      return surveyRepo.save(workingSurvey);
    });
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
    return this.entityManager.transaction(async (manager) => {
      const surveyResponseRepo = manager.getRepository(SurveyResponse);
      const surveyItemResponseRepo = manager.getRepository(SurveyItemResponse);

      // Check for an existing import of this response using its Qualtrics ID.
      let foundPreviousImport = false;
      const previousImport = await surveyResponseRepo.findOne({
        qualtricsResponseId: createInput.responseId,
      });
      if (previousImport) {
        foundPreviousImport = true;
        // We've previously imported this response; toss it and replace it from Qualtrics.
        debug("Delete previously imported response %s", createInput.responseId);
        await SurveyService._deleteSurveyResponse(manager, previousImport.id);
      }

      // Load the survey and its items from the database.
      const survey = await manager.findOneOrFail(Survey, surveyId, {
        relations: ["surveyItems"],
      });

      // If this response has a group code, associate it with the group.
      const codeWord = createInput.values[survey.groupCodeKey];
      let group = null;
      if (codeWord) {
        group = await this.groupService.findGroupByCodeWord(codeWord);
      }
      debug("Code word '%s', group %O", codeWord, group);

      // Save response metadata to the database.
      const newSurveyResponse = await surveyResponseRepo.save(
        surveyResponseRepo.create({
          survey,
          email: createInput.values[survey.emailKey] || "??",
          codeWord: codeWord || "??",
          group,
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
          longitude: createInput.values["locationLongitude"] || "??",
        })
      );

      // Map the qualtrics ID for each question to its database ID.
      // We will only import responses to these questions.
      const qualtricsIdToId = new Map<string, number>(
        survey.surveyItems.map((item) => [item.qualtricsId, item.id])
      );

      // Save response for each question to database. Use the above
      // map to avoid inserting any response that doesn't exist in the survey.
      // This may be unnecessarily paranoid.
      for (const [key, value] of Object.entries(createInput.values)) {
        if (key.startsWith("QID") && qualtricsIdToId.has(key)) {
          const label = createInput.labels[key];
          await surveyItemResponseRepo.save(
            surveyItemResponseRepo.create({
              surveyResponse: newSurveyResponse,
              surveyItemId: qualtricsIdToId.get(key),
              label: label,
              value: parseInt(value),
            })
          );
        }
      }

      return {
        isDuplicate: foundPreviousImport,
        surveyResponse: newSurveyResponse,
      };
    });
  }
}

@Injectable()
export class SurveyDimensionService extends BaseService<SurveyDimension> {
  constructor(
    @InjectRepository(SurveyDimension)
    private readonly surveyDimensionRepo: Repository<SurveyDimension>
  ) {
    super(surveyDimensionRepo);
  }
}

@Injectable()
export class SurveyIndexService extends BaseService<SurveyIndex> {
  constructor(
    @InjectRepository(SurveyIndex)
    private readonly surveyDimensionRepo: Repository<SurveyIndex>
  ) {
    super(surveyDimensionRepo);
  }
}

@Injectable()
export class SurveyLetterService {
  constructor(
    @InjectRepository(SurveyLetter)
    private readonly surveyletterRepo: Repository<SurveyLetter>
  ) {}

  createSurveyLetter(createInput: SurveyLetterCreateInput) {
    return this.surveyletterRepo.save(
      this.surveyletterRepo.create(createInput)
    );
  }

  readSurveyLetters() {
    return this.surveyletterRepo.find();
  }

  updateSurveyLetter(updateInput: SurveyLetterUpdateInput) {
    return this.surveyletterRepo
      .preload(updateInput)
      .then((result) => this.surveyletterRepo.save(result));
  }

  deleteSurveyLetter(id: number) {
    return this.surveyletterRepo.delete(id).then((result) => result.affected);
  }
}
