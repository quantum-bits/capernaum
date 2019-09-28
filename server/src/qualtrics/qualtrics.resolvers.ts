import { Args, Query, Resolver } from "@nestjs/graphql";
import { QualtricsService } from "./qualtrics.service";
import { QualtricsSurveyListItem } from "./qualtrics.entities";

@Resolver()
export class QualtricsResolver {
  constructor(private readonly qualtricsService: QualtricsService) {}

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
            qualtricsIsActive: element.isActive
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
    return surveyList;
  }
}
