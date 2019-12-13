import { Args, Query, Resolver } from "@nestjs/graphql";
import { QualtricsService } from "./qualtrics.service";
import { QualtricsSurveyListItem } from "./qualtrics.entities";
import { SurveyService } from "../survey/survey.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

@Resolver()
@UseGuards(GqlAuthGuard)
export class QualtricsResolver {
  constructor(
    private readonly qualtricsService: QualtricsService,
    private readonly surveyService: SurveyService
  ) {}

  @Query(returns => [QualtricsSurveyListItem])
  async qualtricsSurveys(
    @Args({
      name: "includeInactive",
      type: () => Boolean,
      defaultValue: false,
      nullable: true
    })
    includeInactive: boolean
  ) {
    let surveyList: QualtricsSurveyListItem[] = [];
    let fetchMore = true;
    let offset: string = undefined;
    while (fetchMore) {
      const response = await this.qualtricsService.listSurveys(offset);
      const { elements, nextPage } = response;

      elements.forEach(element => {
        if (element.isActive || includeInactive) {
          surveyList.push({
            qualtricsId: element.id,
            qualtricsName: element.name,
            qualtricsOwnerId: element.ownerId,
            qualtricsModDate: element.lastModified,
            qualtricsCreationDate: element.creationDate,
            qualtricsIsActive: element.isActive,
            importedAs: []
          });
        }
      });

      if (nextPage) {
        const url = new URL(nextPage);
        offset = url.searchParams.get("offset");
      } else {
        fetchMore = false;
      }
    }

    for (let qualtricsSurvey of surveyList) {
      const surveys = await this.surveyService.findSurveyByQualtricsId(
        qualtricsSurvey.qualtricsId
      );
      for (const survey of surveys) {
        qualtricsSurvey.importedAs.push(survey);
        // console.log(JSON.stringify(survey, null, 2));
      }
    }

    return surveyList;
  }
}
