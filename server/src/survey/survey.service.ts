import { Inject, Injectable } from "@nestjs/common";
import {
  QualtricsImportInput,
  Survey,
  SurveyCreateInput,
  SurveyDimension,
  SurveyDimensionCreateInput,
  SurveyDimensionUpdateInput,
  SurveyIndex,
  SurveyIndexCreateInput,
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

    createInput.itemIds.forEach(async itemId => {
      const item = await this.surveyItemRepo.findOneOrFail(itemId);
      item.surveyIndex = newIndex;
      this.surveyItemRepo.save(item);
    });

    return newIndex;
  }

  readAll() {
    return this.surveyRepo.find();
  }

  readOne(id: number) {
    return this.surveyRepo.findOne(id);
  }

  async updateSurvey(updateInput: SurveyUpdateInput) {
    const preload = await this.surveyRepo.preload(updateInput);
    return this.surveyRepo.save(preload);
  }

  async updateSurveyDimension(updateInput: SurveyDimensionUpdateInput) {
    const preload = await this.surveyDimensionRepo.preload(updateInput);
    return this.surveyDimensionRepo.save(preload);
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
