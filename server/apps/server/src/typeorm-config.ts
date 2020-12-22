import { config } from "dotenv";
config();

import { ConnectionOptions } from "typeorm";

import {
  Letter,
  LetterElement,
  LetterElementType,
  LetterType,
} from "./letter/entities";
import {
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyItemResponse,
  SurveyResponse,
} from "./survey/entities";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice,
} from "./prediction/entities";
import { Image } from "./image/entities";
import { User, UserRole } from "./user/entities";
import { Event } from "./events/entities";
import { Machine } from "./machine/entities";
import { Group } from "@server/src/group/entities/group";

const options: ConnectionOptions = {
  type: "postgres",
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  logging: true,
  entities: [
    Event,
    Group,
    Image,
    Letter,
    LetterType,
    LetterElement,
    LetterElementType,
    Machine,
    PredictionTableEntry,
    ScriptureEngagementPractice,
    Survey,
    SurveyDimension,
    SurveyIndex,
    SurveyItem,
    SurveyItemResponse,
    SurveyResponse,
    User,
    UserRole,
  ],
};

export default options;
