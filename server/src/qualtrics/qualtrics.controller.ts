import debug from "debug";

import { Body, Controller, Post, Headers } from "@nestjs/common";
import {
  QualtricsSurveyResponse,
  RawActivateDeactivateSurvey,
  WebHookActivateDeactivateSurvey,
  WebHookCompletedResponse
} from "./qualtrics.types";
import { EventService } from "../events/event.service";
import { EventCreateInput } from "../events/entities";
import { QualtricsService } from "./qualtrics.service";
import { SurveyService } from "../survey/survey.service";
import WriterService from "../writer/writer.service";
import { MailService } from "../mail/mail.service";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { quillDeltaToHtml, quillHtmlToText } from "../helpers/quill";

const qualtricsDebug = debug("qualtrics");

@Controller("qualtrics")
export class QualtricsController {
  constructor(
    private readonly eventService: EventService,
    private readonly qualtricsService: QualtricsService,
    private readonly surveyService: SurveyService,
    private readonly writerService: WriterService,
    private readonly mailService: MailService
  ) {}

  private parseActivateDeactivate(
    body: RawActivateDeactivateSurvey
  ): WebHookActivateDeactivateSurvey {
    return {
      Topic: body.Topic,
      event: JSON.parse(body.event),
      BrandID: body.BrandID
    };
  }

  private surveyName(reply: WebHookActivateDeactivateSurvey) {
    return `'${reply.event.common.SurveyName}' (${reply.event.common.SurveyID})`;
  }

  @Post("activate-survey")
  activateSurvey(@Body() body) {
    const reply = this.parseActivateDeactivate(body);
    qualtricsDebug("activateSurvey %O", reply);

    const createInput: EventCreateInput = {
      type: "Activated",
      details: `Survey ${this.surveyName(reply)} activated`
    };
    return this.eventService.createEvent(createInput);
  }

  @Post("deactivate-survey")
  deactivateSurvey(@Body() body) {
    const reply = this.parseActivateDeactivate(body);
    qualtricsDebug("deactivateSurvey %O", reply);

    const createInput: EventCreateInput = {
      type: "Deactivated",
      details: `Survey ${this.surveyName(reply)} deactivated`
    };
    return this.eventService.createEvent(createInput);
  }

  // Not triggered by default
  @Post("started-session")
  startedSession(@Body() body) {
    qualtricsDebug("startedSession", body);
  }

  // Not triggered by default
  @Post("partial-response")
  partialResponse(@Body() body) {
    qualtricsDebug("partialResponse", body);
  }

  @Post("completed-response")
  async completedResponse(@Headers() headers, @Body() body) {
    const reply: WebHookCompletedResponse = body;
    qualtricsDebug("completedResponse %O", reply);

    const qualtricsSurveyId = reply.SurveyID;
    const qualtricsResponseId = reply.ResponseID;
    qualtricsDebug(
      "qSurveyId %s - qResponseId %s",
      qualtricsSurveyId,
      qualtricsResponseId
    );

    // Find the survey
    const survey = await this.surveyService.findSurveyByQualtricsId(
      qualtricsSurveyId
    );
    qualtricsDebug("survey - %O", survey);

    // Grab the response from Qualtrics
    const qualtricsResponse = await this.qualtricsService.getOneResponse(
      qualtricsSurveyId,
      qualtricsResponseId
    );
    qualtricsDebug("qualtricsResponse - %O", qualtricsResponse);

    // Store it locally.
    const importedResponse = await this.surveyService.importQualtricsSurveyResponse(
      survey.id,
      qualtricsResponse as QualtricsSurveyResponse
    );
    qualtricsDebug("importedResponse - %O", importedResponse);

    // Fetch the letter.
    // TODO: Sort out how to pass stuff to `renderLetter`.
    const letter = await this.surveyService.findLetter(survey.id);

    // Write a letter.
    const writerOutput = await this.writerService.renderLetter(
      letter.id,
      importedResponse.surveyResponse.id
    );
    qualtricsDebug("writerOutput - %O", writerOutput);

    // Convert Quill deltas to HTML and text.
    const htmlContent = quillDeltaToHtml(letter.emailMessage);
    const textContent = quillHtmlToText(htmlContent);

    // Send an email.
    const mailInfo = await this.mailService.sendMail({
      to: importedResponse.surveyResponse.email,
      subject: "Your Christian Life Survey Results",
      textContent,
      htmlContent,
      attachmentPath: writerOutput.pdfAbsolutePath
    });
    qualtricsDebug("mailInfo - %O", mailInfo);

    // Create event.
    const createInput: EventCreateInput = {
      type: "Completed",
      details: `Survey '${qualtricsSurveyId}' completed; response '${qualtricsResponseId}'`
    };
    return this.eventService.createEvent(createInput);
  }
}
