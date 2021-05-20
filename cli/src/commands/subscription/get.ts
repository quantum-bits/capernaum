import { Command } from "@oclif/command";
import { QualtricsApiService } from "../../../../server/libs/qualtrics-api";

export default class SubscriptionGet extends Command {
  static description = "get a single subscription";

  static args = [
    {
      name: "id",
      description: "Subscription ID (SUB_...)",
      required: true,
    },
  ];

  async run() {
    const { args } = this.parse(SubscriptionGet);
    const qualtricsService = new QualtricsApiService();

    qualtricsService
      .getSubscription(args.id)
      .then((response) => this.log(response))
      .catch((error) => this.log(error));
  }
}
