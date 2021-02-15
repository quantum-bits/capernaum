import { times, timesSeries } from "async";
import { MultiTimer } from "../../apps/server/src/helpers/MultiTimer";

const mt = new MultiTimer();
const PARALLEL = false; // Run times() or timesSeries()?

function iteratee(n, next) {
  mt.record(`ITERATEE ${n}`);
  setTimeout(() => {
    const result = n * 2;
    mt.record(`RESULT ${result}`);
    next(null, result);
  }, 250);
}

function callback(err, results) {
  if (err) {
    throw err;
  }
  mt.record(`RESULTS ${results}`);
  console.log(mt.report());
}

mt.record("BEFORE");
if (PARALLEL) {
  times(5, iteratee, callback);
} else {
  timesSeries(5, iteratee, callback);
}
mt.record("AFTER");
