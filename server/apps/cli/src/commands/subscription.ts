import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("subscription");

export function createSubscription(
  publicationUrl: string,
  surveyId: string,
  options
) {
  const qualtricsService = new QualtricsApiService();
  debug("createSubscription %O", { publicationUrl, surveyId, options });

  qualtricsService
    .createSubscription(publicationUrl, options["topic"], surveyId)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

export function listSubscriptions() {
  const qualtricsService = new QualtricsApiService();

  qualtricsService
    .listSubscriptions()
    .then((response) => console.log(JSON.stringify(response, null, 2)))
    .catch((error) => this.log(error));
}

export function getSubscription(subscriptionId: string) {
  const qualtricsService = new QualtricsApiService();

  qualtricsService
    .getSubscription(subscriptionId)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

export function deleteSubscription(subscriptionId: string) {
  const qualtricsService = new QualtricsApiService();

  qualtricsService
    .deleteSubscription(subscriptionId)
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}
