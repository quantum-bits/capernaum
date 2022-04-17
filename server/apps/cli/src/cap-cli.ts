import { config } from "dotenv";
config();

import PrettyError = require("pretty-error");
PrettyError.start();

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
  showHierarchy,
  listSurveyLetters,
  dumpEnv,
  listUsers,
  createUser,
  changePassword,
  deleteSurvey,
} from "./commands";
import { WebhookEventFactory } from "@qapi/qualtrics-api.service";
import { SurveyRespondentType } from "@server/src/survey/survey.types";
import { listLetters } from "@common/cli/src/commands/letter";
import { sendTestEmail } from "@common/cli/src/commands/mail";
import { dumpDebugCache } from "@helpers/debug-factory";

const program = new Command();
program.version("0.0.1");

// User

const userCommands = program.command("user").description("user commands");

userCommands.command("list").description("list all users").action(listUsers);

userCommands
  .command("create")
  .description("create a new user")
  .argument("<first-name>", "user first name")
  .argument("<last-name>", "user last name")
  .argument("<email>", "user email address")
  .argument("<password>", "plain-text password")
  .action(createUser);

userCommands
  .command("password")
  .description("change user password")
  .argument("<user-id>", "database user ID")
  .argument("<new-password>", "plaint-text new password")
  .action(changePassword);

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
  .command("get")
  .argument("<survey-id>", "survey ID (SV_...)")
  .description("get survey by ID")
  .action(getQualtricsSurvey);

const qualtricsResponseCommands = qualtricsCommands
  .command("response")
  .description("response commands");

qualtricsResponseCommands
  .command("get")
  .argument("<survey-id>", "survey ID (SV_...)")
  .argument("[response-id]", "response ID (R_...)")
  .description("get response(s)")
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
  .command("get")
  .argument("<subscription-id>", "subscription ID (SUB_...)")
  .description("get subscription with ID")
  .action(getSubscription);

qualtricsSubscriptionCommands
  .command("create")
  .argument("<publication-url>", "public URL to notify")
  .argument("<survey-id>", "survey ID (SV_...)")
  .description("subscribe to an event")
  .addOption(
    new Option("--topic <name>", "topic to subscribe")
      .choices(validEventNames())
      .makeOptionMandatory()
  )
  .action(createSubscription);

qualtricsSubscriptionCommands
  .command("delete")
  .argument("<subscription-id>", "subscription ID (SUB_...)")
  .description("delete an event subscription")
  .action(deleteSubscription);

// Survey

const surveyCommands = program.command("survey").description("survey commands");

surveyCommands
  .command("list")
  .description("list all surveys")
  .action(listSurveys);

surveyCommands
  .command("import")
  .argument("<survey-id>", "survey ID (SV_...)")
  .description("import survey by ID")
  .action(importSurvey);

surveyCommands
  .command("letters")
  .description("list survey letters")
  .action(listSurveyLetters);

surveyCommands
  .command("delete")
  .argument("<survey-id>", "survey ID (database key)")
  .description("delete a survey with malice aforethought")
  .action(deleteSurvey);

// Group

const groupCommands = program.command("group").description("group commands");

groupCommands
  .command("list")
  .option("--open", "only groups with future close date")
  .option("--ready", "only closed groups ready for report")
  .description("list groups")
  .action(listGroups);

groupCommands
  .command("get")
  .argument("<code-word>", "code word for group")
  .option("--with-responses", "include all responses for group")
  .description("get group by code word")
  .action(getGroup);

groupCommands
  .command("close")
  .argument("<group-pk>", "group PK")
  .description("close group")
  .action(closeGroup);

groupCommands
  .command("force-report")
  .argument("<group-pk>", "group PK")
  .description("force report")
  .action(forceGroupReport);

// Response

const responseCommands = program
  .command("response")
  .description("survey response commands");

responseCommands
  .command("import")
  .argument("<survey-id>", "survey ID (SV_...)")
  .description("import responses to survey")
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
  .command("individual")
  .argument("<letter-pk>", "letter PK")
  .argument("<survey_response-pk>", "survey response PK")
  .description("create letter for response")
  .action((letterPk, surveyResponsePk) =>
    renderLetter(letterPk, surveyResponsePk, SurveyRespondentType.Individual)
  );

letterCommands
  .command("group")
  .argument("<letter-pk>", "letter PK")
  .argument("<group-pk>", "group PK")
  .description("create letter for group")
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
  .command("individual")
  .argument("<qualtrics-survey-id>", "Qualtrics survey ID (SV_...)")
  .argument("<qualtrics-response-id>", "Qualtrics response ID (R_...)")
  .description("queue an individual report job")
  .action(queueIndividualReport);

reporterCommands
  .command("group")
  .argument("<group-pk>", "group PK")
  .description("create and email group report")
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

// Sundries

program.command("env").description("show process environment").action(dumpEnv);

program
  .command("debug-cache")
  .description("show debug cache")
  .action(dumpDebugCache);

program
  .command("gql <query-string>")
  .description("Run a GraphQL query")
  .action(graphQLQuery);

program
  .command("hierarchy")
  .description("show complete command hierarchy")
  .option("--verbose", "show details of all commands", false)
  .action((options) => showHierarchy(options, program));

// Do it.
program.parseAsync().then(() => {
  return knex.destroy();
});
