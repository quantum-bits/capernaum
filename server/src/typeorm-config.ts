import { config } from "dotenv";

import { ConnectionOptions } from "typeorm";
import { Letter, LetterElement, LetterElementType } from "./letter/entities";
import {
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyItemResponse,
  SurveyResponse
} from "./survey/entities";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice
} from "./prediction/entities";
import { Image } from "./image/entities";
import { User, UserRole } from "./user/entities";
import { Event } from "./events/entities";

config();

const options: ConnectionOptions = {
  type: "postgres",
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  entities: [
    Event,
    Letter,
    LetterElement,
    LetterElementType,
    SurveyDimension,
    SurveyResponse,
    SurveyItemResponse,
    Survey,
    SurveyIndex,
    SurveyItem,
    ScriptureEngagementPractice,
    PredictionTableEntry,
    Image,
    User,
    UserRole
  ]
};

export default options;
