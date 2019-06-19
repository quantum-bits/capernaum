import { Command, flags } from "@oclif/command";
import QualtricsAPI from "../../../api/src/QualtricsAPI";
import chalk from "chalk";
import { table } from "table";
import { format, parse, compareAsc } from "date-fns";

interface ListSurveysResult {
  id: string;
  isActive: boolean;
  lastModified: string;
  name: string;
  ownerId: string;
}

const enum SubCommand {
  Get = "get",
  List = "list"
}

export default class Survey extends Command {
  static description = "get survey details";

  static args = [
    {
      name: "subcommand",
      description: "survey action",
      required: true,
      default: SubCommand.List,
      options: [SubCommand.Get, SubCommand.List]
    },
    {
      name: "surveyId",
      description: "Survey identifier (for `get`)"
    }
  ];

  static flags = {
    "by-date": flags.boolean({
      description: "Sort by date (default by name)"
    })
  };

  async run() {
    const api = new QualtricsAPI();
    const { args, flags } = this.parse(Survey);

    switch (args.subcommand) {
      case SubCommand.Get:
        if (!args.surveyId) {
          this.error("`get` command requires a survey identifier");
        }
        api.getSurvey(args.surveyId).then(response => {
          this.log(response.data);
        });
        break;
      case SubCommand.List:
        api.getSurvey().then(response => {
          const elements: ListSurveysResult[] = response.data.result.elements;
          const headers = ["Id", "Name", "Last Modified"].map(hdr =>
            chalk.greenBright(hdr)
          );
          const data = [[...headers]];
          const sortFn = flags["by-date"]
            ? (a: ListSurveysResult, b: ListSurveysResult) =>
                compareAsc(parse(a.lastModified), parse(b.lastModified))
            : (a: ListSurveysResult, b: ListSurveysResult) =>
                a.name.localeCompare(b.name);
          elements.sort(sortFn).map(elt => {
            const { id, name, lastModified } = elt;
            data.push([id, name, format(parse(lastModified), "YYYY-MM-DD")]);
          });
          this.log(table(data));
        });
        break;
    }
  }
}
