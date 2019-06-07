import axios from "axios";

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

  private async get(...urlSegments: string[]) {
    urlSegments.unshift(this.base_url);
    return axios.get(urlSegments.join("/"), {
      headers: {
        "x-api-token": this.api_token
      }
    });
  }

  private async post(data: object, ...urlSegments: string[]) {
    urlSegments.unshift(this.base_url);
    return axios.post(urlSegments.join("/"), data, {
      headers: {
        "x-api-token": this.api_token
      }
    });
  }

  /** Get a survey with the given ID. If no ID, get them all. */
  async getSurvey(surveyId?: string) {
    if (surveyId) {
      return this.get("surveys", surveyId);
    } else {
      return this.get("surveys");
    }
  }

  /** Get an organization's details. */
  async getOrganization(organizationId: string) {
    return this.get("organizations", organizationId);
  }

  async createResponseExport(surveyId: string) {
    return this.post(
      { format: "json" },
      "surveys",
      surveyId,
      "export-responses"
    );
  }

  async getResponseExportProgress(surveyId: string, progressId: string) {
    return this.get("surveys", surveyId, "export-responses", progressId);
  }

  async getResponseExportFile(surveyId: string, fileId: string) {
    return this.get("surveys", surveyId, "export-responses", fileId, "file");
  }
}
