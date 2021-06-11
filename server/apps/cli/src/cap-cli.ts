import { config } from "dotenv";
config();

import PrettyError = require("pretty-error");
PrettyError.start();

import { knex } from "./models/db";

import { Command, Option } from "commander";
import {
  createSubscription,
  deleteSubscription,
  getGroup,
  getQualtricsResponse,
  getSubscription,
  getSurvey,
  graphQLQuery,
  importSurvey,
  importSurveyResponses,
  listGroups,
  listSubscriptions,
  listSurveys,
  predictEngagement,
  showOrg,
  nuclearOption,
  calculateDimensions,
  summarizeResponse,
  meanSurveyIndices,
} from "./commands";
import { WebhookEventFactory } from "@qapi/qualtrics-api.service";

const program = new Command();
program.version("0.0.1");

// Qualtrics

const qualtricsCommands = program
  .command("qualtrics")
  .description("qualtrics commands");

qualtricsCommands
  .command("org")
  .description("show organization details")
  .action(showOrg);

const qualtricsSurveyCommands = qualtricsCommands
  .command("survey")
  .description("survey commands");

qualtricsSurveyCommands
  .command("list")
  .option("--by-date", "sort by date")
  .option("--all", "show all, active and inactive")
  .description("list all surveys")
  .action(listSurveys);

qualtricsSurveyCommands
  .command("get <survey-id>")
  .description("get survey by ID", {
    "survey-id": "survey ID (SV_...)",
  })
  .action(getSurvey);

const qualtricsResponseCommands = qualtricsCommands
  .command("response")
  .description("response commands");

qualtricsResponseCommands
  .command("get <survey-id> [response-id]")
  .description("get response(s)", {
    "survey-id": "survey ID (SV_...)",
    "response-id": "response ID (R_...)",
  })
  .option("--start-date", "start date (YYYY-MM-DD)")
  .option("--end-date", "end date (YYYY-MM-DD)")
  .action(getQualtricsResponse);

const qualtricsSubscriptionCommands = qualtricsCommands
  .command("subscription")
  .description("subscription commands");

function validEventNames(): string[] {
  const factory = new WebhookEventFactory();
  return factory.validNameArray();
}

qualtricsSubscriptionCommands
  .command("list")
  .description("list all subscriptions")
  .action(listSubscriptions);

qualtricsSubscriptionCommands
  .command("get <subscription-id>")
  .description("get subscription with ID", {
    "subscription-id": "subscription ID (SUB_...)",
  })
  .action(getSubscription);

qualtricsSubscriptionCommands
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

qualtricsSubscriptionCommands
  .command("delete <subscription-id>")
  .description("delete an event subscription", {
    "subscription-id": "subscription ID (SUB_...)",
  })
  .action(deleteSubscription);

// Survey

const surveyCommands = program.command("survey").description("survey commands");

surveyCommands
  .command("import <survey-id>")
  .description("import survey by ID", { "survey-id": "survey ID (SV_...)" })
  .action(importSurvey);

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

const responseCommands = program
  .command("response")
  .description("survey response commands");

responseCommands
  .command("import <survey-id>")
  .description("import responses to survey", {
    "survey-id": "survey ID (SV_...)",
  })
  .action(importSurveyResponses);

responseCommands
  .command("dimensions <survey-response-pk>")
  .description("calculate dimensions")
  .action(calculateDimensions);

responseCommands
  .command("summarize <survey-response-pk>")
  .description("summarize response")
  .action(summarizeResponse);

responseCommands
  .command("predict <prediction-table-pk> <survey-response-pk>")
  .description("predict scripture engagement")
  .action(predictEngagement);

responseCommands
  .command("msi <survey-response-pk>")
  .description("calculate mean survey indices")
  .action(meanSurveyIndices);

// Fixture

const fixtureCommands = program
  .command("fixture")
  .description("fixture loader commands");

fixtureCommands
  .command("nuke")
  .description("nuclear option; replace almost all data")
  .option("--force", "force nuclear option (no confirmation)")
  .option("--survey-id <survey-id>", "qualtrics ID of survey to import")
  .action(nuclearOption);

program
  .command("gql <query-string>")
  .description("Run a GraphQL query")
  .action(graphQLQuery);

// Do it.
program.parseAsync().then(() => knex.destroy());
