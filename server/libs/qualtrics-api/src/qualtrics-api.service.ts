import {
  extractZipContent,
  isValidDate,
  normalizeDateTime,
  sleep,
  ZipFileEntry,
} from "./helpers";
import {
  CreateResponseData,
  CreateResponseExportResponse,
  CreateSubscriptionResponse,
  QualtricsArrayResponse,
  QualtricsPostData,
  QualtricsResponse,
  QualtricsSurvey,
  QualtricsSurveyList,
  ResponseExportProgress,
} from "@qapi/qualtrics-api.types";
import { Injectable } from "@nestjs/common";

import got, { Got, Options } from "got";
import {
  QualtricsOrganization,
  QualtricsSubscription,
} from "@server/src/qualtrics/entities";
import tunnel from "tunnel";
import * as events from "events";
import { getDebugger } from "@helpers/debug-factory";

const qualtricsDebug = getDebugger("qualtrics");

interface WebhookEvent {
  name: string;
  details: string;
  takesSurveyId: boolean;
}

export class WebhookEventFactory {
  private webhookEvents: WebhookEvent[] = [
    {
      name: "activate-survey",
      details: "controlpanel.activateSurvey",
      takesSurveyId: false,
    },
    {
      name: "deactivate-survey",
      details: "controlpanel.deactivateSurvey",
      takesSurveyId: false,
    },
    {
      name: "started-session",
      details: "surveyengine.startedRecipientSession",
      takesSurveyId: true,
    },
    {
      name: "partial-response",
      details: "surveyengine.partialResponse",
      takesSurveyId: true,
    },
    {
      name: "completed-response",
      details: "surveyengine.completedResponse",
      takesSurveyId: true,
    },
  ];

  validNameArray(): string[] {
    return this.webhookEvents.map((event) => event.name);
  }

  validNames(): string {
    return this.validNameArray().join(", ");
  }

  makeEvent(name: string, surveyId?: string): string {
    for (const event of this.webhookEvents) {
      if (event.name === name) {
        if (event.takesSurveyId) {
          return `${event.details}.${surveyId}`;
        } else {
          return event.details;
        }
      }
    }
    throw Error(
      `Invalid event name '${name}'; valid names are: ${this.validNames()}`
    );
  }
}

@Injectable()
export class QualtricsApiService {
  baseUrl = "";
  apiToken = "";
  client: Got;
  eventFactory: WebhookEventFactory = new WebhookEventFactory();

  constructor() {
    if (process.env.QUALTRICS_BASE_URL) {
      this.baseUrl = process.env.QUALTRICS_BASE_URL;
    } else {
      throw new Error("No base URL configured in environment");
    }

    if (process.env.QUALTRICS_API_TOKEN) {
      this.apiToken = process.env.QUALTRICS_API_TOKEN;
    } else {
      throw new Error("No API token configured in environment");
    }

    // Common client options.
    const extendOptions: Options = {
      headers: { "x-api-token": this.apiToken },
    };

    // Configure proxy if required.
    if (process.env.PROXY_HOST && process.env.PROXY_PORT) {
      const tunnelingAgent = tunnel.httpsOverHttp({
        proxy: {
          host: process.env.PROXY_HOST,
          port: parseInt(process.env.PROXY_PORT),
        },
      });

      extendOptions.agent = { https: tunnelingAgent };
    }

    qualtricsDebug("common options %O", extendOptions);
    this.client = got.extend(extendOptions);
  }

  private makeUrl(...segments: string[]) {
    segments.unshift(this.baseUrl);
    return new URL(segments.join("/"));
  }

  /**
   * Get data from Qualtrics.
   * @param url
   */
  private async qualtricsGet<T>(url: URL) {
    qualtricsDebug("qualtricsGet - URL %s", url);
    try {
      const response = await this.client.get<QualtricsResponse<T>>(url.href, {
        responseType: "json",
      });
      qualtricsDebug("qualtricsGet - response %O", response.body);
      return response.body.result;
    } catch (error) {
      qualtricsDebug("qualtricsGet - error %O", error.response.statusCode);
      throw error;
    }
  }

  private async qualtricsGetArray<T>(url: URL) {
    qualtricsDebug("qualtricsGetArray - URL %s", url);
    const response = await this.client.get<QualtricsArrayResponse<T>>(
      url.href,
      {
        responseType: "json",
      }
    );
    qualtricsDebug("qualtricsGet - response %O", response.body);
    return response.body.result.elements;
  }

  private async qualtricsDelete<T>(url: URL) {
    qualtricsDebug("qualtricsDelete - URL %s", url);
    const response = await this.client.delete<QualtricsResponse<T>>(url.href, {
      responseType: "json",
    });
    qualtricsDebug("qualtricsDelete - response %O", response.body);
    return response.body.meta.httpStatus;
  }

  /**
   * Post data to Qualtrics.
   * @param url
   * @param data
   */
  private qualtricsPost<T>(url: URL, data: QualtricsPostData) {
    qualtricsDebug("qualtricsPost - URL %s\nData %O", url, data);
    return this.client
      .post<QualtricsResponse<T>>(url.href, {
        responseType: "json",
        json: data,
      })
      .then((response) => {
        qualtricsDebug("qualtricsPost - response %O", response.body);
        return response.body.result;
      })
      .catch((error) => {
        throw Error(error);
      });
  }

  /** Get an organization's details. */
  getOrganization(organizationId: string): Promise<QualtricsOrganization> {
    return this.qualtricsGet<QualtricsOrganization>(
      this.makeUrl("organizations", organizationId)
    );
  }

  /** Get a survey with the given ID. */
  getSurvey(surveyId: string): Promise<QualtricsSurvey> {
    return this.qualtricsGet<QualtricsSurvey>(
      this.makeUrl("surveys", surveyId)
    );
  }

  /** List all surveys */
  listSurveys(offset: string = undefined): Promise<QualtricsSurveyList> {
    const url = this.makeUrl("surveys");
    if (offset) {
      url.searchParams.set("offset", offset);
    }
    qualtricsDebug("listSurveys - %O", url);
    return this.qualtricsGet<QualtricsSurveyList>(url);
  }

  listSubscriptions(): Promise<QualtricsSubscription[]> {
    const url = this.makeUrl("eventsubscriptions");
    const subscriptions = this.qualtricsGetArray<QualtricsSubscription>(url);
    qualtricsDebug("listSubscriptions - %O", subscriptions);
    return subscriptions;
  }

  /** Create an event subscription */
  async createSubscription(
    publicationUrl: string,
    eventName: string,
    surveyId?: string
  ): Promise<QualtricsSubscription> {
    const url = this.makeUrl("eventsubscriptions");
    const response = await this.qualtricsPost<CreateSubscriptionResponse>(url, {
      publicationUrl: publicationUrl,
      topics: this.eventFactory.makeEvent(eventName, surveyId),
    });
    if (response) {
      const subscriptionId = response.id;
      return this.getSubscription(subscriptionId);
    } else {
      throw Error("Couldn't create subscription");
    }
  }

  deleteSubscription(subscriptionId: string): Promise<string> {
    return this.qualtricsDelete(
      this.makeUrl("eventsubscriptions", subscriptionId)
    );
  }

  getSubscription(subscriptionId: string): Promise<QualtricsSubscription> {
    return this.qualtricsGet<QualtricsSubscription>(
      this.makeUrl("eventsubscriptions", subscriptionId)
    );
  }

  /** New-ish endpoint to export a single response. */
  getOneResponse(surveyId: string, responseId: string) {
    const url = this.makeUrl("surveys", surveyId, "responses", responseId);
    qualtricsDebug("getOneResponse - %s", url);
    return this.qualtricsGet(url);
  }

  /** Raw methods to export responses from Qualtrics. */
  async createResponseExport(
    surveyId: string,
    startDate?: string,
    endDate?: string
  ): Promise<CreateResponseExportResponse> {
    const postData: CreateResponseData = { format: "json" };

    if (startDate) {
      if (isValidDate(startDate)) {
        postData.startDate = normalizeDateTime(startDate);
      } else {
        throw new Error(`${startDate} is not a valid date`);
      }
    }

    if (endDate) {
      if (isValidDate(endDate)) {
        postData.endDate = normalizeDateTime(endDate);
      } else {
        throw new Error(`${endDate} is not a valid date`);
      }
    }

    return this.qualtricsPost<CreateResponseExportResponse>(
      this.makeUrl("surveys", surveyId, "export-responses"),
      postData
    );
  }

  getResponseExportProgress(
    surveyId: string,
    progressId: string
  ): Promise<ResponseExportProgress> {
    return this.qualtricsGet<ResponseExportProgress>(
      this.makeUrl("surveys", surveyId, "export-responses", progressId)
    );
  }

  async getResponseExportFile(surveyId: string, fileId: string) {
    const url = this.makeUrl(
      "surveys",
      surveyId,
      "export-responses",
      fileId,
      "file"
    );
    qualtricsDebug(
      "getResponseExportFile URL %s\nSURVEY %s\nFILE %s\n",
      url.href,
      surveyId,
      fileId
    );
    return this.client
      .get(url.href, { responseType: "buffer" })
      .then((response) => extractZipContent(response.body))
      .catch((err) => {
        throw err;
      });
  }

  /** Request, await, and fetch responses. */
  async getResponses(
    surveyId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ZipFileEntry[]> {
    // Start the export.
    const createResult = await this.createResponseExport(
      surveyId,
      startDate,
      endDate
    );

    if (!createResult) {
      throw Error("Failed to fetch create result");
    }

    // Await completion of the export.
    let exportResult: ResponseExportProgress;
    let awaitingResponse = true;
    while (awaitingResponse) {
      exportResult = await this.getResponseExportProgress(
        surveyId,
        createResult.progressId
      );

      if (exportResult.status === "complete") {
        awaitingResponse = false;
      } else {
        await sleep(2000);
      }
    }
    qualtricsDebug("getResponses result %O", exportResult);

    // Fetch the export data itself. Returns a Promise of ZipEntry objects.
    return this.getResponseExportFile(surveyId, exportResult.fileId);
  }
}
