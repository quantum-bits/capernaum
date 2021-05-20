import { Command } from "@oclif/command";
import { QualtricsApiService } from "../../../../server/libs/qualtrics-api";

export default class SubscriptionList extends Command {
  static description = "list subscriptions";

  async run() {
    const qualtricsService = new QualtricsApiService();

    qualtricsService
      .listSubscriptions()
      .then((response) => this.log(JSON.stringify(response, null, 2)))
      .catch((error) => this.log(error));
  }
}
