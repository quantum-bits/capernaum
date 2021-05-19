import fields from "./fields.json";
import { DateTime } from "luxon";
import { readFileSync, writeFileSync } from "fs";
import minimist from "minimist";
import { basename } from "path";

import Chance from "chance";
const chance = new Chance();

function fieldValue(field, group_code, email_address) {
  // console.log(field);
  switch (field.type) {
    case "datetime":
      return DateTime.now().toFormat("yyyy-LL-dd hh:mm:ss");
    case "email":
      return email_address ? email_address : chance.email();
    case "empty":
      return "";
    case "first-name":
      return chance.first();
    case "group-code":
      return group_code;
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

function usage() {
  const file_name = basename(process.argv[1]);
  console.error(
    `usage: ${file_name} -n <survey-count> [--email <email-addr>] [--gid <group-id>] <output-file-name>`
  );
  process.exit(1);
}

const argv = minimist(process.argv.slice(2));
// console.log("ARGV", argv);
const survey_count = parseInt(argv.n);
const output_file_name = argv._[0];

if (!survey_count || !output_file_name) {
  usage();
}

const output_lines = [];

output_lines.push(readFileSync("header-lines.csv", "utf-8"));

for (let i = 0; i < survey_count; i++) {
  const response = fields
    .map((field) => fieldValue(field, argv.gid || "", argv.email))
    .join(",");
  output_lines.push(response + "\r");
}

writeFileSync(output_file_name, output_lines.join("\n"));

console.log(`Wrote ${survey_count} records to '${output_file_name}'`);
