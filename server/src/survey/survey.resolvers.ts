import {
  Args,
  Mutation,
  Parent,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import {
  QualtricsImportInput,
  Survey,
  SurveyCreateInput,
  SurveyItem,
  SurveyUpdateInput
} from "./entities";
import { SurveyService } from "./survey.service";
import { BaseResolver } from "../base/base.resolver";
import { QualtricsService } from "../qualtrics/qualtrics.service";
import { Inject } from "@nestjs/common";
import { QualtricsQuestion } from "../qualtrics/qualtrics.types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Resolver(of => Survey)
export class SurveyResolver extends BaseResolver(Survey) {
  @Inject(QualtricsService) private readonly qualtricsService: QualtricsService;
  @InjectRepository(SurveyItem)
  private readonly surveyItemRepository: Repository<SurveyItem>;
  @InjectRepository(Survey)
  private readonly surveyRepository: Repository<Survey>;

  constructor(private readonly surveyService: SurveyService) {
    super(surveyService);
  }

  @Mutation(returns => Survey)
  createSurvey(
    @Args("createInput")
    createInput: SurveyCreateInput
  ) {
    return this.surveyService.create(createInput);
  }

  @Mutation(returns => Survey)
  updateSurvey(
    @Args("updateInput")
    updateInput: SurveyUpdateInput
  ) {
    return this.surveyService.update(updateInput);
  }

  @ResolveProperty(type => [SurveyItem])
  surveyItems(@Parent() survey) {
    return this.surveyItemRepository.find({ survey: survey });
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

  @Mutation(returns => Survey)
  async importQualtricsSurvey(
    @Args("importInput") qualtricsImportInput: QualtricsImportInput
  ) {
    // Fetch the survey with the given ID from the Qualtrics API.
    const qualtricsSurvey = await this.qualtricsService
      .getSurvey(qualtricsImportInput.qualtricsId)
      .then(response => response.data.result);

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
        // Looks like a real question.
        newSurveyItems.push(
          this.surveyItemRepository.create({
            qualtricsId: questionId,
            qualtricsText: question.questionText.trim()
          })
        );
      }
    }
    await this.surveyItemRepository.save(newSurveyItems);

    // Construct the survey.
    const newSurvey = this.surveyRepository.create({
      title: qualtricsImportInput.title,
      qualtricsId: qualtricsSurvey.id,
      qualtricsName: qualtricsSurvey.name,
      qualtricsModDate: qualtricsSurvey.lastModifiedDate,
      surveyItems: newSurveyItems
    });
    return this.surveyRepository.save(newSurvey);
  }
}
