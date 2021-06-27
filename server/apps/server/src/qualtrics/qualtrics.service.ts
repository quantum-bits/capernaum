import { Injectable } from "@nestjs/common";
import {
  Survey,
  SurveyItem,
  SurveyItemResponse,
  SurveyResponse,
} from "@server/src/survey/entities";
import { QualtricsSurveyResponse } from "@qapi/qualtrics-api.types";
import {
  QualtricsImportedResponse,
  QualtricsResponseImportStats,
} from "@server/src/survey/survey.types";
import { getDebugger } from "@helpers/debug-factory";
import { SurveyService } from "@server/src/survey/services";
import { getManager } from "typeorm";
import { SurveyResponseService } from "@server/src/survey/services/survey-response.service";
import { GroupService } from "@server/src/group/group.service";
import { QualtricsID } from "@server/src/qualtrics/qualtrics.types";
import { QualtricsApiService } from "@qapi/qualtrics-api.service";

const debug = getDebugger("qualtrics");

@Injectable()
export class QualtricsService {
  constructor(
    private readonly qualtricsApiService: QualtricsApiService,
    private readonly surveyService: SurveyService,
    private readonly groupService: GroupService
  ) {}

  /**
   * Import details from a Qualtrics survey into Capernaum.
   */
  async importFromQualtrics(qualtricsId: QualtricsID): Promise<Survey> {
    debug("import survey %s from qualtrics", qualtricsId);
    const qualtricsSurvey = await this.qualtricsApiService.getSurvey(
      qualtricsId
    );

    return getManager().transaction(async (manager) => {
      const surveyItemRepo = manager.getRepository(SurveyItem);
      const surveyRepo = manager.getRepository(Survey);

      // Check whether we already have imported the survey.
      let workingSurvey = await this.surveyService.findByQualtricsId(
        qualtricsSurvey.id
      );

      if (!workingSurvey) {
        // Haven't imported this survey. Create a new one.
        debug("Survey not in database; creating new one");
        workingSurvey = surveyRepo.create({
          qualtricsId: qualtricsSurvey.id,
          qualtricsName: qualtricsSurvey.name,
          qualtricsModDate: qualtricsSurvey.lastModifiedDate,
          surveyItems: [],
        });
      } else {
        debug(`Survey '${qualtricsSurvey.id}' already in database; updating`);
        workingSurvey.qualtricsName = qualtricsSurvey.name;
        workingSurvey.qualtricsModDate = qualtricsSurvey.lastModifiedDate;
      }

      // Create or update questions for this survey.
      for (const [qualtricsId, question] of Object.entries(
        qualtricsSurvey.questions
      )) {
        if (question.questionType.type === "TE") {
          // This question asks for text input. The only ones we care about here are
          // the ones for the questions having a Qualtrics name of "EMAIL" or "GROUP_CODE".
          debug("Found a text question %O", question);
          const responseKey = `${qualtricsId}_TEXT`;
          if (question.questionName === "EMAIL") {
            workingSurvey.emailKey = responseKey;
            debug(`Found the EMAIL question - '${responseKey}'`);
          } else if (question.questionName === "GROUP_CODE") {
            workingSurvey.groupCodeKey = responseKey;
            debug(`Found the GROUP_CODE question - '${responseKey}'`);
          } else {
            debug("Ignoring this text question");
          }
        } else if (
          question.questionType.type === "MC" &&
          question.choices &&
          Object.keys(question.choices).length == 7
        ) {
          // This question is a multiple choice question with seven choices.
          // Consider it one of the main survey questions and import it.
          debug("Handling question %s", qualtricsId);
          const trimmedQuestionText = question.questionText.trim();

          // See if we've already imported it.
          const existingItem = workingSurvey.findItem(qualtricsId);
          if (existingItem) {
            // Already have this question; update it.
            debug(`Update existing question to '${trimmedQuestionText}'`);
            existingItem.qualtricsText = trimmedQuestionText;
            existingItem.qualtricsName = question.questionName;
            await surveyItemRepo.save(existingItem);
          } else {
            // New question; create it.
            debug(`Add new question ${qualtricsId} - ${trimmedQuestionText}`);
            const newItem = surveyItemRepo.create({
              qualtricsId,
              qualtricsText: trimmedQuestionText,
              qualtricsName: question.questionName,
            });
            await surveyItemRepo.save(newItem);
            workingSurvey.surveyItems.push(newItem);
          }
        }
      }

      workingSurvey.importedDate = new Date();
      debug("Working survey %O", workingSurvey);

      // Save everything to the database.
      debug("Save to the database");
      return surveyRepo.save(workingSurvey);
    });
  }

  async importAllResponsesForQualtricsSurvey(qualtricsId: QualtricsID) {
    debug("import all responses for '%s'", qualtricsId);

    // Grab the (previously imported) survey.
    const survey = await this.surveyService.findByQualtricsId(qualtricsId);
    debug("survey id %d", survey.id);

    // Get from Qualtrics all responses to this survey.
    const zipFileEntries = await this.qualtricsApiService.getResponses(
      qualtricsId
    );
    const allResponses = JSON.parse(zipFileEntries[0].content).responses;
    debug("fetched %d responses from qualtrics %O", allResponses.length);

    // For each response retrieved from Qualtrics, import it into the database.
    const importStats = new QualtricsResponseImportStats();
    for (const oneResponse of allResponses) {
      const importResponse = await this.importOneResponseForQualtricsSurvey(
        survey.id,
        oneResponse
      );

      importStats.importCount += 1;
      if (importResponse.isDuplicate) {
        importStats.duplicateCount += 1;
      }
      importStats.surveyResponses.push(importResponse.surveyResponse);
    }

    return importStats;
  }

  /**
   * Import from Qualtrics one respondent's response to a survey.
   * @param surveyId - database survey ID
   * @param createInput - details of the response from Qualtrics
   */
  async importOneResponseForQualtricsSurvey(
    surveyId: number,
    createInput: QualtricsSurveyResponse
  ): Promise<QualtricsImportedResponse> {
    debug("import response '%s'", createInput.responseId);

    return getManager().transaction(async (manager) => {
      const surveyResponseRepo = manager.getRepository(SurveyResponse);
      const surveyItemResponseRepo = manager.getRepository(SurveyItemResponse);

      // Check for an existing import of this response using its Qualtrics ID.
      let foundPreviousImport = false;
      const previousImport = await surveyResponseRepo.findOne({
        qualtricsResponseId: createInput.responseId,
      });
      if (previousImport) {
        foundPreviousImport = true;
        // We've previously imported this response; toss it and replace it from Qualtrics.
        debug("Delete previously imported response %s", createInput.responseId);
        await SurveyResponseService._deleteHelper(manager, previousImport.id);
      }

      // Load the survey and its items from the database.
      const survey = await manager.findOneOrFail(Survey, surveyId, {
        relations: ["surveyItems"],
      });

      // If this response has a group code, associate it with the group.
      const codeWord = createInput.values[survey.groupCodeKey];
      let group = null;
      if (codeWord) {
        group = await this.groupService.findByCodeWord(codeWord);
      }
      debug("Code word '%s', group %O", codeWord, group);

      // Save response metadata to the database.
      const newSurveyResponse = await surveyResponseRepo.save(
        surveyResponseRepo.create({
          survey,
          email: createInput.values[survey.emailKey] || "??",
          codeWord: codeWord || "??",
          group,
          qualtricsResponseId: createInput.responseId || "??",
          startDate: createInput.values["startDate"] || "??",
          endDate: createInput.values["endDate"] || "??",
          recordedDate: createInput.values["recordedDate"] || "??",
          status: parseInt(createInput.values["status"]) || -1,
          ipAddress: createInput.values["ipAddress"] || "??",
          progress: parseInt(createInput.values["progress"]) || -1,
          duration: parseInt(createInput.values["duration"]) || -1,
          finished: parseInt(createInput.values["finished"]) || -1,
          latitude: createInput.values["locationLatitude"] || "??",
          longitude: createInput.values["locationLongitude"] || "??",
        })
      );

      // Map the qualtrics ID for each question to its database ID.
      // We will only import responses to these questions.
      const qualtricsIdToSurveyItem = new Map<string, SurveyItem>(
        survey.surveyItems.map((item) => [item.qualtricsId, item])
      );

      // Save response for each question to database. Use the above
      // map to avoid inserting any response that doesn't exist in the survey.
      // This may be unnecessarily paranoid.
      for (const [key, value] of Object.entries(createInput.values)) {
        if (key.startsWith("QID") && qualtricsIdToSurveyItem.has(key)) {
          const label = createInput.labels[key];
          await surveyItemResponseRepo.save(
            surveyItemResponseRepo.create({
              surveyResponse: newSurveyResponse,
              surveyItem: qualtricsIdToSurveyItem.get(key),
              label: label,
              value: parseInt(value),
            })
          );
        }
      }

      return {
        isDuplicate: foundPreviousImport,
        surveyResponse: newSurveyResponse,
      };
    });
  }
}
