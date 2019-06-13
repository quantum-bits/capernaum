import axios, { AxiosResponse } from "axios";
import {
  extractZipContent,
  isValidDate,
  normalizeDateTime,
  sleep
} from "./helpers";

import debug from "debug";
const apiDebug = debug("api");

interface CreateResponseData {
  format: string;
  startDate?: string;
  endDate?: string;
}

interface QualtricsResponse {
  meta: {
    requestId: string;
    httpStatus: string;
  };
}

type ResponseExportStatus = "inProgress" | "complete" | "failed";

interface CreateResponseExportResponse extends QualtricsResponse {
  result: {
    progressId: string;
    percentComplete: number;
    status: ResponseExportStatus;
  };
}

interface ResponseExportProgress extends QualtricsResponse {
  result: {
    percentComplete: number;
    status: ResponseExportStatus;
    fileId: string;
  };
}

export default class QualtricsAPI {
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
    return segments.join("/");
  }

  private async get<T>(url: string, moreConfig: object = {}) {
    return axios.get<T>(url, {
      headers: {
        "x-api-token": this.api_token
      },
      ...moreConfig
    });
  }

  private async post<T>(url: string, data: object) {
    return axios.post<T>(url, data, {
      headers: {
        "x-api-token": this.api_token
      }
    });
  }

  /** Get a survey with the given ID. If no ID, get them all. */
  async getSurvey(surveyId?: string) {
    if (surveyId) {
      return this.get(this.makeUrl("surveys", surveyId));
    } else {
      return this.get(this.makeUrl("surveys"));
    }
  }

  /** Get an organization's details. */
  async getOrganization(organizationId: string) {
    return this.get(this.makeUrl("organizations", organizationId));
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
    const createResult = await this.createResponseExport(
      surveyId,
      startDate,
      endDate
    );

    apiDebug("createResult %O", createResult.data);

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

    return this.getResponseExportFile(
      surveyId,
      exportResult!.data.result.fileId
    );
  }
}
