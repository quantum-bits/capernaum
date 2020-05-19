import { ScriptureEngagementPractice } from "../prediction/entities";
import { Field, Float, Int, ObjectType } from "type-graphql";
import { SurveyResponse } from "./entities";

import numbro from 'numbro';

// Used to filter which survey items are retrieved for a survey.
export enum WhichItems {
  All,
  WithIndex,
  WithoutIndex
}

@ObjectType()
export class ChartEntry {
  @Field()
  title: string;

  @Field(type => Int)
  value: number;
}

@ObjectType()
export class ChartData {
  @Field()
  title: string;

  @Field(type => [ChartEntry])
  entries: ChartEntry[];

  constructor(title: string, entries: ChartEntry[]) {
    this.title = title;
    this.entries = entries;
  }

  allTitles() {
    return this.entries.map(entry => entry.title).join(",");
  }

  allCoordinates() {
    return this.entries
      .map(entry => `(${entry.value},${entry.title})`)
      .join("\n");
  }

  allBarLabels() {
    return this.entries
      .map(entry => {
        if ( entry.value >= 4 ) {
          let horizCoord = entry.value - 0.35;
          let value = numbro(entry.value).format({thousandSeparated: false, trimMantissa: true, mantissa: 2});
          return `\\node[text=white] at (axis cs:${horizCoord},${entry.title}) {${value}};`
        } else {
          let horizCoord = entry.value + 0.35;
          let value = numbro(entry.value).format({thousandSeparated: false, trimMantissa: true, mantissa: 2});
          return `\\node[text=black] at (axis cs:${horizCoord},${entry.title}) {${value}};`
        }
      })
      .join("\n");
  }

}

@ObjectType()
export class PredictionDetails {
  @Field()
  title: string;

  @Field()
  abbreviation: string;

  @Field(type => Float)
  meanResponse: number;
}

@ObjectType()
export class Prediction {
  @Field(type => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

  @Field(type => [PredictionDetails])
  details: PredictionDetails[];

  @Field()
  predict: boolean;
}

@ObjectType()
export class QualtricsResponseImportStats {
  @Field(type => Int) importCount: number;
  @Field(type => Int) duplicateCount: number;
  @Field(type => [SurveyResponse]) surveyResponses: SurveyResponse[];

  constructor() {
    this.importCount = 0;
    this.duplicateCount = 0;
    this.surveyResponses = [];
  }
}

export interface QualtricsImportedResponse {
  isDuplicate: boolean;
  surveyResponse: SurveyResponse;
}
