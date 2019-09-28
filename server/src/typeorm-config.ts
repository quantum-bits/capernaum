import { config } from "dotenv";

import { ConnectionOptions } from "typeorm";
import {
  Letter,
  LetterElement,
  LetterElementType,
  SurveyLetter
} from "./letter/entities";
import {
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyItemResponse,
  SurveyResponse
} from "./survey/entities";
import {
  PredictionTable,
  PredictionTableEntry,
  ScriptureEngagementPractice
} from "./prediction/entities";

config();

const options: ConnectionOptions = {
  type: "postgres",
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  entities: [
    Letter,
    LetterElement,
    LetterElementType,
    SurveyDimension,
    SurveyLetter,
    SurveyResponse,
    SurveyItemResponse,
    Survey,
    SurveyIndex,
    SurveyItem,
    ScriptureEngagementPractice,
    PredictionTable,
    PredictionTableEntry
  ]
};

export default options;
