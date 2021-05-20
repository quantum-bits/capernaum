import { Command } from "@oclif/command";
import { QualtricsApiService } from "../../../../server/libs/qualtrics-api";
import { WebhookEventFactory } from "../../../../server/libs/qualtrics-api";

export default class SubscriptionCreate extends Command {
  static description = "create a subscription";

  static eventFactory = new WebhookEventFactory();

  static args = [
    {
      name: "publication-url",
      description: "Fully qualified URL; must accept POST request",
      required: true,
    },
    {
      name: "topics",
      description:
        "Subscribe to topics: " + SubscriptionCreate.eventFactory.validNames(),
      required: true,
    },
    {
      name: "survey-id",
      required: true,
    },
  ];

  async run() {
    const { args } = this.parse(SubscriptionCreate);
    const qualtricsService = new QualtricsApiService();

    qualtricsService
      .createSubscription(
        args["publication-url"],
        args.topics,
        args["survey-id"]
      )
      .then((response) => this.log(response))
      .catch((error) => this.log(error));
  }
}
