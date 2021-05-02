import fields from "./fields.json";
import { DateTime } from "luxon";
import { readFileSync } from "fs";

import Chance from "chance";
const chance = new Chance();

function fieldValue(field) {
  // console.log(field);
  switch (field.type) {
    case "datetime":
      return DateTime.now().toFormat("yyyy-LL-dd hh:mm:ss");
    case "email":
      return chance.email();
    case "empty":
      return "";
    case "first-name":
      return chance.first();
    case "ip":
      return chance.ip();
    case "last-name":
      return chance.last();
    case "likert":
      return chance.integer({ min: 1, max: 7 });
    case "literal":
      return field.value;
    case "random-int":
      return chance.integer({ min: field.range[0], max: field.range[1] });
    case "random-str":
      return chance.string({
        alpha: true,
        symbols: false,
        length: field.length,
      });
    default:
      throw new Error(`invalid field: ${field}`);
  }
}

const header_lines = readFileSync("header-lines.csv", "utf-8");
console.log(header_lines);

for (let i = 0; i < 10; i++) {
  const response = fields.map((field) => fieldValue(field)).join(",");
  console.log(response + "\r");
}
