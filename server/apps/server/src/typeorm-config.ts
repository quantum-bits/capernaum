import { DataSourceOptions } from "typeorm";
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
  SurveyLetter,
  SurveyResponse,
} from "./survey/entities";
import { ScriptureEngagementPractice } from "./prediction/entities";
import { Image } from "./image/entities";
import { User, UserRole } from "./user/entities";
import { Event } from "./events/entities";
import { Machine } from "./machine/entities";
import { Group, GroupType } from "./group/entities";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("orm");

export const entities = [
  Event,
  Group,
  GroupType,
  Image,
  Letter,
  LetterType,
  LetterElement,
  LetterElementType,
  Machine,
  ScriptureEngagementPractice,
  Survey,
  SurveyDimension,
  SurveyIndex,
  SurveyItem,
  SurveyItemResponse,
  SurveyLetter,
  SurveyResponse,
  User,
  UserRole,
];

export const options: DataSourceOptions = {
  type: "postgres",
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  entities,
  logging: debug.enabled,
};
