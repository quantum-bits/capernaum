import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import { QualtricsSurveyListItem } from "./entities/qualtrics-survey-list-item";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { Survey } from "../survey/entities";
import { SurveyService } from "@server/src/survey/services";
import { QualtricsResponseImportStats } from "../survey/survey.types";
import {
  QualtricsOrganization,
  QualtricsSubscription,
  QualtricsSubscriptionCreateInput,
} from "./entities";
import { QualtricsService } from "@server/src/qualtrics/qualtrics.service";
import { QualtricsID } from "@server/src/qualtrics/qualtrics.types";
import { getDebugger } from "@helpers/debug-factory";
import is from "is";

const debug = getDebugger("qualtrics");

@Resolver()
@UseGuards(GqlAuthGuard)
export class QualtricsResolver {
  constructor(
    private readonly qualtricsApiService: QualtricsApiService,
    private readonly qualtricsService: QualtricsService,
    private readonly surveyService: SurveyService
  ) {}

  @Query(() => [QualtricsSurveyListItem])
  async qualtricsSurveys(
    @Args({
      name: "includeInactive",
      type: () => Boolean,
      defaultValue: false,
      nullable: true,
    })
    includeInactive: boolean
  ) {
    const surveyList: QualtricsSurveyListItem[] = [];
    let fetchMore = true;
    let offset: string = undefined;
    while (fetchMore) {
      const response = await this.qualtricsApiService.listSurveys(offset);
      const { elements, nextPage } = response;

      for (const element of elements) {
        const survey = await this.surveyService.findByQualtricsId(element.id);
        if (element.isActive || includeInactive) {
          surveyList.push({
            qualtricsId: element.id,
            qualtricsName: element.name,
            qualtricsOwnerId: element.ownerId,
            qualtricsModDate: element.lastModified,
            qualtricsCreationDate: element.creationDate,
            qualtricsIsActive: element.isActive,
            capernaumSurvey: survey,
          });
        }
      }

      if (nextPage) {
        const url = new URL(nextPage);
        offset = url.searchParams.get("offset");
      } else {
        fetchMore = false;
      }
    }

    return surveyList;
  }

  @Mutation(() => Survey, {
    description:
      "Import a survey from Qualtrics. Always use this to create a Capernaum survey.",
  })
  async importQualtricsSurvey(
    @Args({ name: "qualtricsId", type: () => String })
    qualtricsId: QualtricsID
  ) {
    return this.qualtricsService.importQualtricsSurvey(qualtricsId);
  }

  @Mutation(() => QualtricsResponseImportStats, {
    description: "Fetch responses to a survey",
  })
  async importQualtricsSurveyResponses(
    @Args("qualtricsId") qualtricsId: string
  ) {
    return this.qualtricsService.importAllResponsesForQualtricsSurvey(
      qualtricsId
    );
  }

  @Query(() => QualtricsOrganization)
  organization(
    @Args({
      name: "organizationId",
      type: () => String,
      defaultValue: process.env.QUALTRICS_ORG_ID,
    })
    organizationId?: string
  ) {
    return this.qualtricsApiService.getOrganization(organizationId);
  }

  @Mutation(() => QualtricsSubscription)
  createSubscription(
    @Args("createInput") createInput: QualtricsSubscriptionCreateInput
  ) {
    let finalSegment = "";
    let eventType = "";
    let surveyId = "";

    switch (createInput.subscriptionType) {
      case "activate-survey":
      case "deactivate-survey":
        eventType = finalSegment = createInput.subscriptionType;
        break;
      case "started-session":
      case "partial-response":
        throw Error(
          `No support for subscription '${createInput.subscriptionType}'`
        );
      case "completed-response":
        if (createInput.surveyId) {
          eventType = finalSegment = createInput.subscriptionType;
          surveyId = createInput.surveyId;
        } else {
          throw Error("Missing survey ID for completed response");
        }
        break;
      default:
        throw Error(
          `Invalid subscription type '${createInput.subscriptionType}'`
        );
    }

    const returnValue = this.qualtricsApiService.createSubscription(
      `https://${createInput.hostName}/qualtrics/${finalSegment}`,
      eventType,
      surveyId
    );
    console.log(JSON.stringify(returnValue, null, 2));
    return returnValue;
  }

  @Query(() => [QualtricsSubscription])
  subscriptions() {
    return this.qualtricsApiService.listSubscriptions();
  }

  @Mutation(() => String)
  deleteSubscription(@Args("subscriptionId") subscriptionId: string) {
    return this.qualtricsApiService.deleteSubscription(subscriptionId);
  }
}
