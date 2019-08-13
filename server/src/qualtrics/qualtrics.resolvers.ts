import { QualtricsSurveyMetadata } from "./qualtrics.models";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { QualtricsService } from "./qualtrics.service";

@Resolver(of => QualtricsSurveyMetadata)
export class SurveyResolver {
  constructor(private readonly qualtricsService: QualtricsService) {}

  @Query(returns => [QualtricsSurveyMetadata])
  async surveys(
    @Args({
      name: "includeInactive",
      type: () => Boolean,
      defaultValue: false,
      nullable: true
    })
    includeInactive: boolean
  ) {
    let surveyList: QualtricsSurveyMetadata[] = [];
    let fetchMore = true;
    let offset: string = undefined;
    while (fetchMore) {
      const response = await this.qualtricsService.listSurveys(offset);
      const { elements, nextPage } = response.data.result;

      elements.forEach(element => {
        if (element.isActive || includeInactive) {
          surveyList.push(element);
        }
      });

      if (nextPage) {
        const url = new URL(nextPage);
        offset = url.searchParams.get("offset");
      } else {
        fetchMore = false;
      }
    }
    return surveyList;
  }
}
