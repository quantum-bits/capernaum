import { Injectable } from "@nestjs/common";
import { BaseService } from "@server/src/shared/base.service";
import {
  SurveyDimension,
  SurveyIndex,
  SurveyIndexCreateInput,
  SurveyIndexDeleteOutput,
  SurveyIndexUpdateInput,
  SurveyItem,
} from "@server/src/survey/entities";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { assign, difference, pick } from "lodash";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("survey-index");

@Injectable()
export class SurveyIndexService extends BaseService<SurveyIndex> {
  constructor(
    @InjectRepository(SurveyIndex)
    private readonly repo: Repository<SurveyIndex>
  ) {
    super(repo);
  }

  async construct(createInput: SurveyIndexCreateInput) {
    return this.repo.manager.transaction(async (manager) => {
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

  readAll() {
    return this.repo.find({
      relations: ["surveyItems", "surveyDimension", "predictionTableEntries"],
    });
  }

  update(updateInput: SurveyIndexUpdateInput): Promise<SurveyIndex> {
    return this.repo.manager.transaction(async (manager) => {
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

  // Helper method to avoid nested transactions; do not call directly.
  static async _deleteHelper(
    manager: EntityManager,
    id: number
  ): Promise<SurveyIndexDeleteOutput> {
    debug("_deleteHelper %d", id);
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

  async delete(id: number) {
    return this.repo.manager.transaction(async (manager) =>
      SurveyIndexService._deleteHelper(manager, id)
    );
  }
}
