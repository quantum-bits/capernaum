import { DateTime, DurationUnit } from "luxon";
import _ from "lodash";
import { table } from "table";

class TimeStamp {
  public dt: DateTime;

  constructor(public label: string, public flags = 0) {
    this.dt = DateTime.local();
  }

  elapsed(ts: TimeStamp, unit: DurationUnit = "milliseconds") {
    const diff = ts.dt.diff(this.dt).toObject();
    return diff[unit];
  }

  toString() {
    return `${this.label} ${this.dt.toISOTime()} ${this.flags}`;
  }
}

export class MultiTimer {
  private timeStamps: TimeStamp[] = [];

  constructor() {
    this.record("[START]");
  }

  record(label: string, flags = 0): void {
    this.timeStamps.push(new TimeStamp(label, flags));
  }

  private maxLabelWidth(): number {
    return _.max(this.timeStamps.map((ts) => ts.label.length));
  }

  private totalTime(): number {
    return _.first(this.timeStamps).elapsed(_.last(this.timeStamps));
  }

  private haveFlags(): boolean {
    return this.timeStamps.some((ts) => ts.flags > 0);
  }

  get rawData(): TimeStamp[] {
    return this.timeStamps;
  }

  private static formatPercentage(val: number): string {
    return Number(val).toFixed(2);
  }

  report(prefix = null): string {
    this.record("[STOP]");
    const recordCount = this.timeStamps.length;
    const haveFlags = this.haveFlags();

    const rows = _.map(this.timeStamps, (ts, idx) => {
      const segments: Array<number | string> = [];
      if (prefix) {
        segments.push(prefix);
      }
      segments.push(ts.label, ts.dt.toFormat("hh:mm:ss.SSS"));

      if (idx < recordCount - 1) {
        const elapsed = ts.elapsed(this.timeStamps[idx + 1]);
        segments.push(elapsed);

        const percentage = (elapsed / this.totalTime()) * 100.0;
        segments.push(MultiTimer.formatPercentage(percentage));

        if (haveFlags) {
          segments.push("*".repeat(ts.flags));
        }
      } else {
        segments.push(this.totalTime(), MultiTimer.formatPercentage(100.0));
        if (haveFlags) {
          segments.push("");
        }
      }
      return segments;
    });

    return table(rows, {
      singleLine: true,
      columns: {
        2: { alignment: "right" },
        3: { alignment: "right" },
      },
    });
  }
}

// async function simpleTest() {
//   const mt = new MultiTimer();
//   mt.record("Alpha");
//   mt.record("Beta");
//   mt.record("Gamma");
//   console.log(mt.report());
// }
//
// simpleTest();
