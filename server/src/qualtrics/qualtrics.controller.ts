import debug from "debug";

import { Body, Controller, Post, Headers } from "@nestjs/common";
import {
  RawActivateDeactivateSurvey,
  WebHookActivateDeactivateSurvey,
  WebHookCompletedResponse
} from "./qualtrics.types";
import { EventService } from "../events/event.service";
import { Event, EventCreateInput } from "../events/entities";

const qualtricsDebug = debug("qualtrics");

@Controller("qualtrics")
export class QualtricsController {
  constructor(private readonly eventService: EventService) {}

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
  completedResponse(@Headers() headers, @Body() body) {
    const reply: WebHookCompletedResponse = body;
    qualtricsDebug("completedResponse %O", reply);

    const createInput: EventCreateInput = {
      type: "Completed",
      details: `Survey '${reply.SurveyID}' completed; response '${reply.ResponseID}'`
    };
    return this.eventService.createEvent(createInput);
  }
}
