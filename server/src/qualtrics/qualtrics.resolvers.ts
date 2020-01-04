import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { QualtricsService } from "./qualtrics.service";
import { QualtricsSurveyListItem } from "./qualtrics.entities";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";
import { Survey } from "../survey/entities";
import { SurveyService } from "../survey/survey.service";
import { QualtricsResponseImportStats } from "../survey/survey.types";
import {
  QualtricsOrganization,
  QualtricsSubscription,
  QualtricsSubscriptionCreateInput
} from "./entities";

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

      for (let element of elements) {
        const survey = await this.surveyService.findSurveyByQualtricsId(
          element.id
        );
        if (element.isActive || includeInactive) {
          surveyList.push({
            qualtricsId: element.id,
            qualtricsName: element.name,
            qualtricsOwnerId: element.ownerId,
            qualtricsModDate: element.lastModified,
            qualtricsCreationDate: element.creationDate,
            qualtricsIsActive: element.isActive,
            importedToCapernaum: survey !== null
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

  @Mutation(returns => Survey, {
    description:
      "Import a survey from Qualtrics. Always use this to create a Capernaum survey."
  })
  async importQualtricsSurvey(@Args("qualtricsId") qualtricsId: string) {
    // Fetch the survey with the given ID from the Qualtrics API.
    const qualtricsSurvey = await this.qualtricsService.getSurvey(qualtricsId);

    // Import survey into the database.
    return this.surveyService.importQualtricsSurvey(qualtricsSurvey);
  }

  @Mutation(returns => QualtricsResponseImportStats, {
    description: "Fetch responses to a survey"
  })
  async importQualtricsSurveyResponses(
    @Args("qualtricsId") qualtricsId: string
  ) {
    const survey = await this.surveyService.findSurveyByQualtricsId(
      qualtricsId
    );

    // Get from Qualtrics all responses to this survey.
    const zipFileEntries = await this.qualtricsService.getResponses(
      qualtricsId
    );
    const allResponses = JSON.parse(zipFileEntries[0].content).responses;

    // For each response retrieved from Qualtrics, import it into the database.
    const importStats = new QualtricsResponseImportStats();
    for (const oneResponse of allResponses) {
      const importResponse = await this.surveyService.importQualtricsSurveyResponse(
        survey.id,
        oneResponse
      );

      importStats.importCount += 1;
      if (importResponse.isDuplicate) {
        importStats.duplicateCount += 1;
      }
      importStats.surveyResponses.push(importResponse.surveyResponse);
    }

    return importStats;
  }

  @Query(returns => QualtricsOrganization)
  organization(
    @Args({
      name: "organizationId",
      type: () => String,
      defaultValue: process.env.QUALTRICS_ORG_ID
    })
    organizationId?: string
  ) {
    return this.qualtricsService.getOrganization(organizationId);
  }

  @Mutation(returns => QualtricsSubscription)
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
        break;
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

    const returnValue = this.qualtricsService.createSubscription(
      `https://${createInput.hostName}/qualtrics/${finalSegment}`,
      eventType,
      surveyId
    );
    console.log(JSON.stringify(returnValue, null, 2));
    return returnValue;
  }

  @Query(returns => [QualtricsSubscription])
  subscriptions() {
    return this.qualtricsService.listSubscriptions();
  }

  @Mutation(returns => String)
  deleteSubscription(@Args("subscriptionId") subscriptionId: string) {
    return this.qualtricsService.deleteSubscription(subscriptionId);
  }
}
