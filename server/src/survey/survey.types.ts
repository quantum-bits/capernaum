import { ScriptureEngagementPractice } from "../prediction/entities";
import { Field, Float, Int, ObjectType } from "type-graphql";

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
