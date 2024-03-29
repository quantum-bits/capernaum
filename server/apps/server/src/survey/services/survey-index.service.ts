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
import { EntityManager, In, Repository } from "typeorm";
import * as _ from "lodash";
import { getDebugger } from "@helpers/debug-factory";
import { AssociationUpdateInput } from "@server/src/prediction/entities";

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
    const newIndexId = await this.repo.manager.transaction(async (manager) => {
      const surveyDimensionRepo = manager.getRepository(SurveyDimension);
      const surveyIndexRepo = manager.getRepository(SurveyIndex);
      const surveyItemRepo = manager.getRepository(SurveyItem);

      const dimension = await surveyDimensionRepo.findOneByOrFail({
        id: createInput.surveyDimensionId,
      });

      const newIndex = await surveyIndexRepo.save(
        surveyIndexRepo.create({
          surveyDimension: dimension,
          title: createInput.title,
          abbreviation: createInput.abbreviation,
          useForPredictions: createInput.useForPredictions,
        })
      );

      for (const itemId of createInput.itemIds) {
        const item = await surveyItemRepo.findOneByOrFail({ id: itemId });
        item.surveyIndex = newIndex;
        await surveyItemRepo.save(item);
      }

      return newIndex.id;
    });

    return this.readOne(newIndexId);
  }

  private alwaysRelate = [
    "surveyItems",
    "surveyDimension",
    "scriptureEngagementPractices",
  ];

  readAll() {
    return this.repo.find({
      relations: this.alwaysRelate,
    });
  }

  readOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: this.alwaysRelate,
    });
  }

  /**
   * Update all boolean associations. Do it in a transaction.
   * @param updates
   */
  updateBooleanAssociations(updates: AssociationUpdateInput[]) {
    return this.repo.manager.transaction(async (manager) => {
      await Promise.all(
        _.forEach(updates, async (update) => {
          debug("one update %O", update);
          if (update.predict) {
            // Add a new prediction
            await manager
              .createQueryBuilder()
              .relation(SurveyIndex, "scriptureEngagementPractices")
              .of(update.indexId)
              .add(update.practiceId);
          } else {
            // Remove an existing prediction
            await manager
              .createQueryBuilder()
              .relation(SurveyIndex, "scriptureEngagementPractices")
              .of(update.indexId)
              .remove(update.practiceId);
          }
        })
      );

      const indexIds = _.uniq(_.map(updates, "indexId"));
      debug("Index IDs %o", indexIds);

      return manager
        .createQueryBuilder(SurveyIndex, "sidx")
        .innerJoinAndSelect("sidx.scriptureEngagementPractices", "sep")
        .where("sidx.id IN (:...ids)", { ids: indexIds })
        .getMany();
    });
  }

  update(updateInput: SurveyIndexUpdateInput): Promise<SurveyIndex> {
    return this.repo.manager.transaction(async (manager) => {
      // N.B., can also use the manager directly.
      const surveyIndexRepo = manager.getRepository(SurveyIndex);
      const surveyItemRepo = manager.getRepository(SurveyItem);

      const index = await surveyIndexRepo.findOneOrFail({
        where: { id: updateInput.id },
        relations: { surveyItems: true },
      });

      // Assign scalar updates, if any. Only those props listed will be updated,
      // and then only if present in updateInput.
      _.assign(
        index,
        _.pick(updateInput, ["title", "abbreviation", "useForPredictions"])
      );

      // Fetch survey items specified by the update.
      const updateItems = await surveyItemRepo.findBy({
        id: In(updateInput.itemIds),
      });
      const validUpdateItemIds = updateItems.map((item) => item.id);

      // Check that all specified items actually exist.
      const bogusItemIds = _.difference(
        updateInput.itemIds,
        validUpdateItemIds
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

  // Helper method to avoid nested transactions; do not call directly.
  static async _deleteHelper(
    manager: EntityManager,
    id: number
  ): Promise<SurveyIndexDeleteOutput> {
    debug("_deleteHelper %d", id);
    const index = await manager.findOneOrFail(SurveyIndex, {
      where: { id },
      relations: { surveyItems: true },
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
