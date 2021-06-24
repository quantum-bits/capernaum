import { config } from "dotenv";
import { knex } from "./models/db";

import { Command, Option } from "commander";
import {
  calculateDimensions,
  createSubscription,
  deleteSubscription,
  getGroup,
  getQualtricsResponse,
  getSubscription,
  graphQLQuery,
  importSurvey,
  importSurveyResponses,
  listGroups,
  listSubscriptions,
  listQualtricsSurveys,
  meanSurveyIndices,
  nuclearOption,
  predictEngagement,
  renderLetter,
  showOrg,
  summarizeResponse,
  getQualtricsSurvey,
  listSurveys,
  queueIndividualReport,
  sendGroupReport,
  closeGroup,
  forceGroupReport,
  countGroupPredictions,
} from "./commands";
import { WebhookEventFactory } from "@qapi/qualtrics-api.service";

config();

import PrettyError = require("pretty-error");
import { SurveyRespondentType } from "@server/src/survey/survey.types";
import { listLetters } from "@common/cli/src/commands/letter";
import { sendTestEmail } from "@common/cli/src/commands/mail";
import { dumpDebugCache } from "@helpers/debug-factory";

PrettyError.start();

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
  .action(listQualtricsSurveys);

qualtricsSurveyCommands
  .command("get <survey-id>")
  .description("get survey by ID", {
    "survey-id": "survey ID (SV_...)",
  })
  .action(getQualtricsSurvey);

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
  .command("list")
  .description("list all surveys")
  .action(listSurveys);

surveyCommands
  .command("import <survey-id>")
  .description("import survey by ID", { "survey-id": "survey ID (SV_...)" })
  .action(importSurvey);

// Group

const groupCommands = program.command("group").description("group commands");

groupCommands
  .command("list")
  .option("--open", "only groups with future close date")
  .option("--ready", "only closed groups ready for report")
  .description("list groups")
  .action(listGroups);

groupCommands
  .command("get <code-word>")
  .option("--with-responses", "include all responses for group")
  .description("get group by code word", {
    "code-word": "code word for group",
  })
  .action(getGroup);

groupCommands
  .command("close <group-pk>")
  .description("close group", {
    groupPk: "group PK",
  })
  .action(closeGroup);

groupCommands
  .command("force-report <group-pk>")
  .description("force report", { groupPk: "group PK" })
  .action(forceGroupReport);

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

const dimensionCommands = responseCommands
  .command("dimension")
  .description("dimension commands");

dimensionCommands
  .command("individual <survey-response-pk>")
  .option("--pdf <pdf-file-name>", "save as PDF")
  .option("--dimension <dimension-pk>", "specific dimension (else all)")
  .description("calculate dimensions for one response")
  .action((surveyResponsePk, options) =>
    calculateDimensions(
      surveyResponsePk,
      options,
      SurveyRespondentType.Individual
    )
  );

dimensionCommands
  .command("group <group-pk>")
  .option("---pdf <pdf-file-name>", "Save as PDF")
  .option("--dimension <dimension-pk>", "specific dimension (else all)")
  .description("calculate dimensions for group responses")
  .action((groupPk, options) =>
    calculateDimensions(groupPk, options, SurveyRespondentType.Group)
  );

responseCommands
  .command("summarize <survey-response-pk>")
  .description("summarize response")
  .action(summarizeResponse);

const predictionCommands = responseCommands
  .command("prediction")
  .description("predict scripture engagement commands");

predictionCommands
  .command("individual <survey-response-pk>")
  .description("scripture engagement for individual")
  .action((surveyResponsePk) =>
    predictEngagement(surveyResponsePk, SurveyRespondentType.Individual)
  );

predictionCommands
  .command("group <group-pk>")
  .description("scripture engagement for group")
  .action((surveyResponsePk) =>
    predictEngagement(surveyResponsePk, SurveyRespondentType.Group)
  );

predictionCommands
  .command("count <group-pk>")
  .option("--pdf <pdf-file-name>", "save as PDF")
  .description("count recommendations for group")
  .action(countGroupPredictions);

const msiCommands = responseCommands
  .command("msi")
  .description("mean survey index commands");

msiCommands
  .command("individual <survey-response-pk>")
  .description("calculate mean survey indices for one response")
  .action((surveyResponsePk) =>
    meanSurveyIndices(surveyResponsePk, SurveyRespondentType.Individual)
  );

msiCommands
  .command("group <group-pk>")
  .description("calculate mean survey indices for a group")
  .action((groupPk) => meanSurveyIndices(groupPk, SurveyRespondentType.Group));

// Letter

const letterCommands = program.command("letter").description("letter commands");

letterCommands
  .command("individual <letter-pk> <survey_response-pk>")
  .description("create letter for response", {
    letterPk: "letter PK",
    surveyResponsePk: "survey response PK",
  })
  .action((letterPk, surveyResponsePk) =>
    renderLetter(letterPk, surveyResponsePk, SurveyRespondentType.Individual)
  );

letterCommands
  .command("group <letter-pk> <group-pk>")
  .description("create letter for group", {
    letterPk: "letter PK",
    groupPk: "group PK",
  })
  .action((letterPk, groupPk) =>
    renderLetter(letterPk, groupPk, SurveyRespondentType.Group)
  );

letterCommands
  .command("list")
  .description("list letters and related info")
  .action(listLetters);

// Report

const reporterCommands = program
  .command("report")
  .description("report (create and email) commands");

reporterCommands
  .command("individual <qualtrics-survey-id> <qualtrics-response-id>")
  .description("queue an individual report job", {
    qualtricsSurveyId: "Qualtrics survey ID (SV_...)",
    qualtricsResponseId: "Qualtrics response ID (R_...)",
  })
  .action(queueIndividualReport);

reporterCommands
  .command("group <group-pk>")
  .description("create and email group report", {
    groupPk: "group PK",
  })
  .action(sendGroupReport);

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

// Email
const emailCommands = program.command("email").description("email commands");

emailCommands
  .command("test")
  .description("send test email")
  .action(sendTestEmail);

program
  .command("debug-cache")
  .description("show debug cache")
  .action(dumpDebugCache);

program
  .command("gql <query-string>")
  .description("Run a GraphQL query")
  .action(graphQLQuery);

// Do it.
program.parseAsync().then(() => {
  knex.destroy();
});
