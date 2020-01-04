import {
  extractZipContent,
  isValidDate,
  normalizeDateTime,
  sleep
} from "./helpers";
import {
  CreateResponseData,
  CreateResponseExportResponse,
  CreateSubscriptionResponse,
  QualtricsArrayResponse,
  QualtricsResponse,
  QualtricsSurvey,
  QualtricsSurveyList,
  ResponseExportProgress
} from "./qualtrics.types";
import { Injectable } from "@nestjs/common";

import debug from "debug";
import got, { Got, GotOptions } from "got";
import ProxyAgent from "https-proxy-agent";
import { QualtricsOrganization, QualtricsSubscription } from "./entities";

const qualtricsDebug = debug("qualtrics");

interface WebhookEvent {
  name: string;
  details: string;
  takesSurveyId: boolean;
}

class WebhookEventFactory {
  private webhookEvents: WebhookEvent[] = [
    {
      name: "activate-survey",
      details: "controlpanel.activateSurvey",
      takesSurveyId: false
    },
    {
      name: "deactivate-survey",
      details: "controlpanel.deactivateSurvey",
      takesSurveyId: false
    },
    {
      name: "started-session",
      details: "surveyengine.startedRecipientSession",
      takesSurveyId: true
    },
    {
      name: "partial-response",
      details: "surveyengine.partialResponse",
      takesSurveyId: true
    },
    {
      name: "completed-response",
      details: "surveyengine.completedResponse",
      takesSurveyId: true
    }
  ];

  private validNames() {
    return this.webhookEvents.map(event => event.name).join(", ");
  }

  makeEvent(name: string, surveyId?: string) {
    for (let event of this.webhookEvents) {
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
export class QualtricsService {
  baseUrl: string = "";
  apiToken: string = "";
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
    const commonOptions: GotOptions = {
      headers: { "x-api-token": this.apiToken }
    };

    // Configure proxy if required.
    if (process.env.PROXY_HOST && process.env.PROXY_PORT) {
      commonOptions.agent = new ProxyAgent({
        host: process.env.PROXY_HOST,
        port: parseInt(process.env.PROXY_PORT)
      });
    }

    qualtricsDebug("common options %O", commonOptions);
    this.client = got.extend(commonOptions);
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
    const response = await this.client.get<QualtricsResponse<T>>(url.href, {
      responseType: "json"
    });
    qualtricsDebug("qualtricsGet - response %O", response.body);
    return response.body.result;
  }

  private async qualtricsGetArray<T>(url: URL) {
    qualtricsDebug("qualtricsGetArray - URL %s", url);
    const response = await this.client.get<QualtricsArrayResponse<T>>(
      url.href,
      {
        responseType: "json"
      }
    );
    qualtricsDebug("qualtricsGet - response %O", response.body);
    return response.body.result.elements;
  }

  private async qualtricsDelete<T>(url: URL) {
    qualtricsDebug("qualtricsDelete - URL %s", url);
    const response = await this.client.delete<QualtricsResponse<T>>(url.href, {
      responseType: "json"
    });
    qualtricsDebug("qualtricsDelete - response %O", response.body);
    return response.body.meta.httpStatus;
  }

  /**
   * Post data to Qualtrics.
   * @param url
   * @param data
   */
  private qualtricsPost<T>(url: URL, data: object) {
    qualtricsDebug("qualtricsPost - URL %s\nData %O", url, data);
    return this.client
      .post<QualtricsResponse<T>>(url.href, {
        responseType: "json",
        json: data
      })
      .then(response => {
        qualtricsDebug("qualtricsPost - response %O", response.body);
        return response.body.result;
      })
      .catch(error => {
        throw Error(error);
      });
  }

  /** Get an organization's details. */
  getOrganization(organizationId: string) {
    return this.qualtricsGet<QualtricsOrganization>(
      this.makeUrl("organizations", organizationId)
    );
  }

  /** Get a survey with the given ID. */
  getSurvey(surveyId: string) {
    return this.qualtricsGet<QualtricsSurvey>(
      this.makeUrl("surveys", surveyId)
    );
  }

  /** List all surveys */
  listSurveys(offset: string = undefined) {
    const url = this.makeUrl("surveys");
    if (offset) {
      url.searchParams.set("offset", offset);
    }
    qualtricsDebug("listSurveys - %O", url);
    return this.qualtricsGet<QualtricsSurveyList>(url);
  }

  listSubscriptions() {
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
  ) {
    const url = this.makeUrl("eventsubscriptions");
    const response = await this.qualtricsPost<CreateSubscriptionResponse>(url, {
      publicationUrl: publicationUrl,
      topics: this.eventFactory.makeEvent(eventName, surveyId)
    });
    if (response) {
      const subscriptionId = response.id;
      return this.getSubscription(subscriptionId);
    } else {
      throw Error("Couldn't create subscription");
    }
  }

  deleteSubscription(subscriptionId: string) {
    return this.qualtricsDelete(
      this.makeUrl("eventsubscriptions", subscriptionId)
    );
  }

  getSubscription(subscriptionId: string) {
    return this.qualtricsGet(
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
  ) {
    const postData: CreateResponseData = {
      format: "json"
    };

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

  getResponseExportProgress(surveyId: string, progressId: string) {
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
      .then(response => extractZipContent(response.body))
      .catch(err => {
        throw err;
      });
  }

  /** Request, await, and fetch responses. */
  async getResponses(surveyId: string, startDate?: string, endDate?: string) {
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
