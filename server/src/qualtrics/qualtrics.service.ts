import {
  extractZipContent,
  isValidDate,
  normalizeDateTime,
  sleep
} from "./helpers";
import {
  CreateResponseData,
  CreateResponseExportResponse,
  QualtricsOrganization,
  QualtricsResponse,
  QualtricsSurvey,
  QualtricsSurveyList,
  ResponseExportProgress
} from "./qualtrics.types";
import { Injectable } from "@nestjs/common";

import debug from "debug";
import got, { Got, GotOptions } from "got";
import ProxyAgent from "https-proxy-agent";

const qualtricsDebug = debug("qualtrics");

@Injectable()
export class QualtricsService {
  baseUrl: string = "";
  apiToken: string = "";
  client: Got;

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
      .then(response => response.body.result)
      .catch(err => console.error("qualtricsPost", err));
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
