import axios from "axios";
import { extractZipContent } from "./helpers";

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

  private async get(url: string, moreConfig: object = {}) {
    return axios.get(url, {
      headers: {
        "x-api-token": this.api_token
      },
      ...moreConfig
    });
  }

  private async post(url: string, data: object) {
    return axios.post(url, data, {
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

  /** Export responses from Qualtrics. */
  async createResponseExport(surveyId: string) {
    return this.post(this.makeUrl("surveys", surveyId, "export-responses"), {
      format: "json"
    });
  }

  async getResponseExportProgress(surveyId: string, progressId: string) {
    return this.get(
      this.makeUrl("surveys", surveyId, "export-responses", progressId)
    );
  }

  async getResponseExportFile(surveyId: string, fileId: string) {
    return this.get(
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
}
