import axios from "axios";
import { fromBuffer } from "yauzl";

class ZipFileEntry {
  fileName: string = "";
  content: string = "";

  constructor(fileName: string) {
    this.fileName = fileName;
  }
}

async function extractZipContent(inBuffer: Buffer) {
  console.log("BUFFER", inBuffer, inBuffer.length);
  return new Promise((resolve, reject) => {
    fromBuffer(inBuffer, (err, zipFile) => {
      if (err) {
        return reject(err);
      }
      if (!zipFile) {
        throw new Error("Bogus zipFile");
      }

      const entries: ZipFileEntry[] = [];
      zipFile.on("entry", entry => {
        const currentEntry = new ZipFileEntry(entry.fileName);
        entries.push(currentEntry);

        zipFile.openReadStream(entry, (err, readStream) => {
          if (err) {
            return reject(err);
          }
          if (!readStream) {
            throw new Error("Bogus readStream");
          }
          const chunks: string[] = [];
          readStream.on("data", chunk => {
            console.log("CHUNK", chunk);
            chunks.push(chunk.toString());
          });
          readStream.on("end", () => {
            currentEntry.content = chunks.join("");
            return resolve(entries);
          });
        });
      });
    });
  });
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
        console.log("DATA LEN", response.data.length);
        const b = Buffer.from(response.data, "binary");
        return extractZipContent(b);
      })
      .catch(err => {
        throw err;
      });
  }
}
