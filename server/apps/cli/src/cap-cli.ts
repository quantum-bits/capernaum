import { config } from "dotenv";
config();

import { Command, Option } from "commander";
import {
  createSubscription,
  deleteSubscription,
  getResponse,
  getSubscription,
  getSurvey,
  listGroups,
  listSubscriptions,
  listSurveys,
  showOrg,
  getGroup,
  graphQLQuery,
} from "./commands";
import { WebhookEventFactory } from "@qapi/qualtrics-api.service";

const program = new Command();
program.version("0.0.1");

// Org
program
  .command("org")
  .description("show Qualtrics organization details")
  .action(showOrg);

// Survey
const surveyCommands = program.command("survey").description("survey commands");

surveyCommands
  .command("list")
  .option("--by-date", "sort by date")
  .description("list all surveys")
  .action(listSurveys);

surveyCommands
  .command("get <survey-id>")
  .description("get survey by ID", {
    "survey-id": "survey ID (SV_...)",
  })
  .action(getSurvey);

// Group
const groupCommands = program.command("group").description("group commands");

groupCommands.command("list").description("list all groups").action(listGroups);

groupCommands
  .command("get <code-word>")
  .option("--with-responses", "include all responses for group")
  .description("get group by code word", {
    "code-word": "code word for group",
  })
  .action(getGroup);

// Response
program
  .command("response <survey-id> [response-id]")
  .description("get response(s)", {
    "survey-id": "survey ID (SV_...)",
    "response-id": "response ID (R_...)",
  })
  .option("--start-date", "start date (YYYY-MM-DD)")
  .option("--end-date", "end date (YYYY-MM-DD)")
  .action(getResponse);

// Subscription

function validEventNames(): string[] {
  const factory = new WebhookEventFactory();
  return factory.validNameArray();
}

const subscriptionCommands = program
  .command("subscription")
  .description("event subscription commands");

subscriptionCommands
  .command("list")
  .description("list all subscriptions")
  .action(listSubscriptions);

subscriptionCommands
  .command("get <subscription-id>")
  .description("get subscription with ID", {
    "subscription-id": "subscription ID (SUB_...)",
  })
  .action(getSubscription);

subscriptionCommands
  .command("create <publication-url> <survey-id>")
  .addOption(
    new Option("--topic <name>", "topic to subscribe")
      .choices(validEventNames())
      .makeOptionMandatory()
  )
  .description("subscribe to an event", {
    "publication-url": "public URL to notify",
    "survey-id": "survey ID (SV_...)",
  })
  .action(createSubscription);

subscriptionCommands
  .command("delete <subscription-id>")
  .description("delete an event subscription", {
    "subscription-id": "subscription ID (SUB_...)",
  })
  .action(deleteSubscription);

program
  .command("gql <query-string>")
  .description("Run a GraphQL query")
  .action(graphQLQuery);

// Do it.
program.parse();
