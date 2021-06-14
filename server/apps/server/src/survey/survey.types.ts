import { ScriptureEngagementPractice } from "../prediction/entities";
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { SurveyResponse } from "./entities";

import numbro from "numbro";

// Used to filter which survey items are retrieved for a survey.
export enum WhichItems {
  All,
  WithIndex,
  WithoutIndex,
}

@ObjectType()
export class ChartEntry {
  @Field()
  title: string;

  @Field(() => Int)
  value: number;
}

@ObjectType()
export class ChartData {
  @Field()
  title: string;

  @Field(() => [ChartEntry])
  entries: ChartEntry[];

  constructor(title: string, entries: ChartEntry[]) {
    this.title = title;
    this.entries = entries;
  }

  allTitles(): string {
    return this.entries.map((entry) => entry.title).join(",");
  }

  allCoordinates(): string {
    return this.entries
      .map((entry) => `(${entry.value},${entry.title})`)
      .join("\n");
  }

  allBarLabels(): string {
    return this.entries
      .map((entry) => {
        if (entry.value >= 4) {
          const horizCoord = entry.value - 0.35;
          const value = numbro(entry.value).format({
            thousandSeparated: false,
            trimMantissa: true,
            mantissa: 2,
          });
          return `\\node[text=white] at (axis cs:${horizCoord},${entry.title}) {${value}};`;
        } else {
          const horizCoord = entry.value + 0.35;
          const value = numbro(entry.value).format({
            thousandSeparated: false,
            trimMantissa: true,
            mantissa: 2,
          });
          return `\\node[text=black] at (axis cs:${horizCoord},${entry.title}) {${value}};`;
        }
      })
      .join("\n");
  }
}

@ObjectType()
export class PredictionDetails {
  @Field()
  surveyIndexTitle: string;

  @Field()
  surveyIndexAbbreviation: string;

  @Field(() => Float)
  meanResponse: number;
}

@ObjectType()
export class Prediction {
  @Field(() => ScriptureEngagementPractice)
  practice: ScriptureEngagementPractice;

  @Field(() => [PredictionDetails])
  details: PredictionDetails[];

  @Field()
  predict: boolean;
}

@ObjectType()
export class QualtricsResponseImportStats {
  @Field(() => Int) importCount: number;
  @Field(() => Int) duplicateCount: number;
  @Field(() => [SurveyResponse]) surveyResponses: SurveyResponse[];

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
