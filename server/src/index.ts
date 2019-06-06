import { config } from "dotenv";
config(); // Import configuration to environment.

import QualtricsAPI from "./QualtricsAPI";

const api = new QualtricsAPI();

/*
if (process.env.TEST_SURVEY_ID) {
  api
    .getSurvey(process.env.TEST_SURVEY_ID)
    .then(response => console.log(JSON.stringify(response.data, null, 2)));
} else {
  throw new Error("No survey ID");
}
*/
if (process.env.CAP_ORG_ID) {
  api
    .getOrganization(process.env.CAP_ORG_ID)
    .then(response => console.log(JSON.stringify(response.data, null, 2)));
} else {
  throw new Error("No organization ID");
}
