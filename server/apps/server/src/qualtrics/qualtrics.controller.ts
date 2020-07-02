import debug from "debug";

import { Body, Controller, Post, Headers, Logger } from "@nestjs/common";
import {
  WebHookActivateDeactivateSurvey,
  WebHookCompletedResponse,
} from "@qapi/qualtrics-api/qualtrics-api.types";
import { EventService } from "../events/event.service";
import { EventCreateInput } from "../events/entities";
import { ReporterProducer } from "@apps/reporter/src/reporter.producer";

const qualtricsDebug = debug("qualtrics");

@Controller("qualtrics")
export class QualtricsController {
  constructor(
    private readonly reporterProducer: ReporterProducer,
    private readonly eventService: EventService
  ) {}

  private readonly logger = new Logger(QualtricsController.name);

  private static surveyName(reply: WebHookActivateDeactivateSurvey) {
    return `${reply.SurveyID}`;
  }

  @Post("activate-survey")
  activateSurvey(@Body() body: WebHookActivateDeactivateSurvey) {
    qualtricsDebug("activateSurvey %O", body);

    const createInput: EventCreateInput = {
      type: "Activated",
      details: `Survey ${QualtricsController.surveyName(body)} activated`,
    };
    return this.eventService.createEvent(createInput);
  }

  @Post("deactivate-survey")
  deactivateSurvey(@Body() body: WebHookActivateDeactivateSurvey) {
    qualtricsDebug("deactivateSurvey %O", body);

    const createInput: EventCreateInput = {
      type: "Deactivated",
      details: `Survey ${QualtricsController.surveyName(body)} deactivated`,
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
    this.logger.debug(`completedResponse - ${JSON.stringify(reply, null, 2)}`);

    const qualtricsSurveyId = reply.SurveyID;
    const qualtricsResponseId = reply.ResponseID;
    qualtricsDebug(
      "qSurveyId %s - qResponseId %s",
      qualtricsSurveyId,
      qualtricsResponseId
    );

    this.reporterProducer.requestReport(qualtricsSurveyId, qualtricsResponseId);
  }
}
