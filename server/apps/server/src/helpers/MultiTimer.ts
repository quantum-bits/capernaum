/**
 * Support for multiple time stamps.
 */

import { DateTime, DurationUnit } from "luxon";
import _ from "lodash";
import { table } from "table";

/**
 * A distinct, labeled moment in time.
 */
export class TimeStamp {
  public dt: DateTime;

  /**
   * Create a new `TimeStamp`.
   * @param label String label for this time stamp; used for reporting.
   * @param flags Number of "flag" characters to be output with this time stamp.
   */
  constructor(public label: string, public flags = 0) {
    this.dt = DateTime.local();
  }

  /**
   * Calculate the elapsed time from _this_ time stamp to the
   * supplied time stamp.
   * @param ts The time stamp _from which_ to calculate the elapsed time.
   * @param unit Unit to return (defaults to `milliseconds`)
   */
  elapsed(ts: TimeStamp, unit: DurationUnit = "milliseconds"): number {
    const diff = ts.dt.diff(this.dt).toObject();
    return diff[unit];
  }

  toString(): string {
    return `${this.label} ${this.dt.toISOTime()} ${this.flags}`;
  }
}

export class MultiTimer {
  private timeStamps: TimeStamp[] = [];

  constructor() {
    this.record("[START]");
  }

  /**
   * Record time time by creating a new {@link `TimeStamp`} entry.
   * @param label String label to associated with time stamp.
   * @param flags Number of "flag" characters to include in the output;
   * makes it easier to find particular entries in the output.
   */
  record(label: string, flags = 0): void {
    this.timeStamps.push(new TimeStamp(label, flags));
  }

  private totalTime(): number {
    return _.first(this.timeStamps).elapsed(_.last(this.timeStamps));
  }

  private haveFlags(): boolean {
    return this.timeStamps.some((ts) => ts.flags > 0);
  }

  /**
   * Provide read access to the underlying list of time stamps.
   * @deprecated Was meant only for debugging.
   */
  get rawData(): TimeStamp[] {
    return this.timeStamps;
  }

  private static formatPercentage(val: number): string {
    return Number(val).toFixed(2);
  }

  /**
   * Conclude recording of times for a `MultiTimer`.
   * Add a "stop" entry to the time stamp array, and
   * generate a tabular report of all time stamps.
   * @param prefix Optional prefix to place in front of each line of output;
   * intended to make it easier to read complex output, especially from
   * multiple threads/processes.
   * @return Tabular report of time stamps.
   */
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
