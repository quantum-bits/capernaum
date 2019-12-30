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

  @Post("activate-survey")
  activateSurvey(@Body() body) {
    const reply = this.parseActivateDeactivate(body);
    qualtricsDebug("activateSurvey %O", reply);

    const createInput: EventCreateInput = {
      type: "Activated",
      details: `Survey '${reply.event.common.SurveyID}' activated`
    };
    return this.eventService.create(Event, createInput);
  }

  @Post("deactivate-survey")
  deactivateSurvey(@Body() body) {
    const reply = this.parseActivateDeactivate(body);
    qualtricsDebug("deactivateSurvey %O", reply);

    const createInput: EventCreateInput = {
      type: "Deactivated",
      details: `Survey '${reply.event.common.SurveyID}' deactivated`
    };
    return this.eventService.create(Event, createInput);
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
  }
}
