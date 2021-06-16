import { Field, Int, ObjectType } from "@nestjs/graphql";
import numbro from "numbro";

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
