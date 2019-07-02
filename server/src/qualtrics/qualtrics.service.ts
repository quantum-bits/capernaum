import axios, { AxiosResponse } from "axios";
import {
  extractZipContent,
  isValidDate,
  normalizeDateTime,
  sleep
} from "./helpers";
import {
  GetSurveyResponse,
  ListSurveysResponse,
  GetOrganizationResponse,
  CreateResponseExportResponse,
  ResponseExportProgress,
  CreateResponseData
} from "./qualtrics.types";
import { Injectable } from "@nestjs/common";

import debug from "debug";
const apiDebug = debug("api");

@Injectable()
export class QualtricsService {
  base_url: string = "";
  api_token: string = "";

  constructor() {
    if (process.env.CAP_BASE_URL) {
      this.base_url = process.env.CAP_BASE_URL;
    } else {
      throw new Error("No base URL configured in environment");
    }

    if (process.env.CAP_API_TOKEN) {
      this.api_token = process.env.CAP_API_TOKEN;
    } else {
      throw new Error("No API token configured in environment");
    }
  }

  private makeUrl(...segments: string[]) {
    segments.unshift(this.base_url);
    return new URL(segments.join("/"));
  }

  private async get<T>(url: URL, moreConfig: object = {}) {
    return axios.get<T>(url.href, {
      headers: {
        "x-api-token": this.api_token
      },
      ...moreConfig
    });
  }

  private async post<T>(url: URL, data: object) {
    return axios.post<T>(url.href, data, {
      headers: {
        "x-api-token": this.api_token
      }
    });
  }

  /** Get a survey with the given ID. */
  async getSurvey(surveyId: string) {
    return this.get<GetSurveyResponse>(this.makeUrl("surveys", surveyId));
  }

  async listSurveys(offset: string = undefined) {
    const url = this.makeUrl("surveys");
    if (offset) {
      url.searchParams.set("offset", offset);
    }
    return this.get<ListSurveysResponse>(url);
  }

  /** Get an organization's details. */
  async getOrganization(organizationId: string) {
    return this.get<GetOrganizationResponse>(
      this.makeUrl("organizations", organizationId)
    );
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

    apiDebug("postData %O", postData);

    return this.post<CreateResponseExportResponse>(
      this.makeUrl("surveys", surveyId, "export-responses"),
      postData
    );
  }

  async getResponseExportProgress(surveyId: string, progressId: string) {
    return this.get<ResponseExportProgress>(
      this.makeUrl("surveys", surveyId, "export-responses", progressId)
    );
  }

  async getResponseExportFile(surveyId: string, fileId: string) {
    return this.get<string>(
      this.makeUrl("surveys", surveyId, "export-responses", fileId, "file"),
      {
        responseType: "arraybuffer"
      }
    )
      .then(response => {
        const b = Buffer.from(response.data, "binary");
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
    apiDebug("createResult %O", createResult.data);

    // Await completion of the export.
    let exportResult: AxiosResponse<ResponseExportProgress>;
    let awaitingResponse = true;
    while (awaitingResponse) {
      apiDebug("Waiting for response");
      exportResult = await this.getResponseExportProgress(
        surveyId,
        createResult.data.result.progressId
      );
      apiDebug("exportResult %O", exportResult.data);

      if (exportResult.data.result.status === "complete") {
        awaitingResponse = false;
      } else {
        await sleep(2000);
      }
    }

    // Fetch the export data itself. Returns a Promise of ZipEntry objects.
    return this.getResponseExportFile(
      surveyId,
      exportResult!.data.result.fileId
    );
  }
}
