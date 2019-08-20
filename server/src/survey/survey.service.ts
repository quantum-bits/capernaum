import { Inject, Injectable } from "@nestjs/common";
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
  SurveyItemCreateInput,
  SurveyUpdateInput
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  QualtricsQuestion,
  QualtricsSurvey
} from "../qualtrics/qualtrics.types";
import { Field, Int, ObjectType } from "type-graphql";

@Injectable()
export class SurveyService {
  constructor(
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
        abbreviation: createInput.abbreviation,
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
        title: createInput.title
      })
    );

    for (const itemId of createInput.itemIds) {
      const item = await this.surveyItemRepo.findOneOrFail(itemId);
      item.surveyIndex = newIndex;
      await this.surveyItemRepo.save(item);
    }

    return newIndex;
  }

  readAll() {
    return this.surveyRepo.find();
  }

  readOne(id: number) {
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

  private async removeItemsFromIndex(index: SurveyIndex) {
    const itemIds = index.surveyItems.map(item => item.id);

    if (index.surveyItems) {
      // Yes, there are some to remove.
      await this.surveyItemRepo
        .createQueryBuilder()
        .update(SurveyItem)
        .set({ surveyIndex: null })
        .where("id IN (:...ids)", { ids: itemIds })
        .execute();
    }

    return itemIds;
  }

  private setItemsForIndex(itemIds: number[], index: SurveyIndex) {
    return this.surveyItemRepo
      .createQueryBuilder()
      .update(SurveyItem)
      .set({ surveyIndex: index })
      .where("id IN (:...ids)", { ids: itemIds })
      .execute();
  }

  async updateSurveyIndex(updateInput: SurveyIndexUpdateInput) {
    const index = await this.surveyIndexRepo.findOneOrFail(updateInput.id, {
      relations: ["surveyItems"]
    });

    if (updateInput.title) {
      // Update the title.
      index.title = updateInput.title;
    }
    if (updateInput.itemIds.length > 0) {
      // Update the related items.
      await this.removeItemsFromIndex(index); // Remove any existing associations.
      await this.setItemsForIndex(updateInput.itemIds, index); // Make new associations.
    }

    // Don't do a .save() on the index; it will undo what we've done manually.
    // Note that only the associated items have been changed; not the index itself.
    return index;
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
    const removedItemIds = await this.removeItemsFromIndex(index);
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
