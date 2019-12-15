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
import tunnel from "tunnel";

const qualtricsDebug = debug("qualtrics");

@Injectable()
export class QualtricsService {
  baseUrl: string = "";
  apiToken: string = "";
  httpClient: Got;

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

    // Customize HTTP client.
    // Always want to send the API token.
    const gotOptions: GotOptions = {
      headers: { "x-api-token": this.apiToken },
      responseType: "json"
    };
    // Configure proxy if required.
    if (process.env.PROXY_HOST && process.env.PROXY_PORT) {
      gotOptions.agent = tunnel.httpsOverHttp({
        proxy: {
          host: process.env.PROXY_HOST,
          port: parseInt(process.env.PROXY_PORT)
        }
      });
    }
    qualtricsDebug("gotOptions %O", gotOptions);
    this.httpClient = got.extend(gotOptions);
  }

  private makeUrl(...segments: string[]) {
    segments.unshift(this.baseUrl);
    return new URL(segments.join("/"));
  }

  /**
   * Do an Axios get operation.
   * @param url
   * @param moreConfig - additional parameters for the Axios config object
   */
  private gotGet<T>(url: URL, moreConfig: object = {}) {
    return this.httpClient.get<T>(url.href, moreConfig);
  }

  /**
   * Get data from Qualtrics. Wraps the axiosGet method, awaits the response, and extracts the Qualtrics result.
   * @param url
   * @param moreConfig
   */
  private async qualtricsGet<T>(url: URL, moreConfig: object = {}) {
    const response = await this.gotGet<QualtricsResponse<T>>(url, moreConfig);
    qualtricsDebug("Response data %O", response.body);
    return response.body.result;
  }

  /**
   * Post data to Qualtrics.
   * @param url
   * @param data
   */
  private async qualtricsPost<T>(url: URL, data: object) {
    const axiosResponse = await this.httpClient.post<QualtricsResponse<T>>(
      url.href,
      data
    );
    return axiosResponse.body.result;
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

  listSurveys(offset: string = undefined) {
    const url = this.makeUrl("surveys");
    if (offset) {
      url.searchParams.set("offset", offset);
    }
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

    qualtricsDebug("postData %O", postData);

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
    return this.gotGet<string>(
      this.makeUrl("surveys", surveyId, "export-responses", fileId, "file"),
      {
        responseType: "arraybuffer"
      }
    )
      .then(response => {
        const b = Buffer.from(response.body, "binary");
        return extractZipContent(b);
      })
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
    qualtricsDebug("createResult %O", createResult);

    // Await completion of the export.
    let exportResult: ResponseExportProgress;
    let awaitingResponse = true;
    qualtricsDebug("Await response");
    while (awaitingResponse) {
      exportResult = await this.getResponseExportProgress(
        surveyId,
        createResult.progressId
      );
      qualtricsDebug("exportResult %O", exportResult);

      if (exportResult.status === "complete") {
        awaitingResponse = false;
      } else {
        await sleep(2000);
      }
    }
    qualtricsDebug("Result available %O", exportResult);

    // Fetch the export data itself. Returns a Promise of ZipEntry objects.
    return this.getResponseExportFile(surveyId, exportResult.fileId);
  }
}
