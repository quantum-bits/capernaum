import { QualtricsApiService } from "@qapi/qualtrics-api.service";

import Debug from "debug";
const debug = Debug("response");

export function getResponse(surveyId: string, responseId: string, options) {
  const qualtricsService = new QualtricsApiService();
  debug("surveyId '%s'", surveyId);
  debug("responseId '%s'", responseId);
  debug("options %o", options);

  if (responseId) {
    qualtricsService
      .getOneResponse(surveyId, responseId)
      .then((response) => console.log(JSON.stringify(response, null, 2)))
      .catch((error) => console.error(error));
  } else {
    qualtricsService
      .getResponses(surveyId, options.startDate, options.endDate)
      .then((response) => response[0].content)
      .then((zipFileEntry) => JSON.parse(zipFileEntry))
      .then((jsonData) => console.log(JSON.stringify(jsonData)))
      .catch((error) => console.error(error));
  }
}
