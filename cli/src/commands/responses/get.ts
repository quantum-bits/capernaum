import { Command, flags } from "@oclif/command";
import { QualtricsApiService } from "../../../../server/libs/qualtrics-api";

export default class ResponseList extends Command {
  static description = "get responses";

  static flags = {
    "start-date": flags.string({ description: "first date to fetch" }),
    "end-date": flags.string({ description: "last date to fetch" }),
  };

  static args = [
    { name: "survey-id", required: true },
    { name: "response-id", description: "Get only this response" },
  ];

  async run() {
    const { args, flags } = this.parse(ResponseList);
    const qualtricsService = new QualtricsApiService();

    if (args["response-id"]) {
      qualtricsService
        .getOneResponse(args["survey-id"], args["response-id"])
        .then((response) => this.log(JSON.stringify(response, null, 2)))
        .catch((error) => this.error(error));
    } else {
      qualtricsService
        .getResponses(args["survey-id"], flags["start-date"], flags["end-date"])
        .then((response) => response[0].content)
        .then((zipFileEntry) => JSON.parse(zipFileEntry))
        .then((jsonData) => this.log(JSON.stringify(jsonData, null, 2)))
        .catch((error) => this.error(error));
    }
  }
}
