import { Command, flags } from "@oclif/command";
import { QualtricsService } from "../../qualtrics/qualtrics.service";
import chalk from "chalk";
import { table } from "table";
import { compareAsc, format, parse } from "date-fns";
import { QualtricsSurveyMetadata } from "../../qualtrics/qualtrics.types";

const enum SubCommand {
  Get = "get",
  List = "list"
}

export default class SurveyCommand extends Command {
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
    }),
    verbose: flags.boolean({
      description: "Show details"
    })
  };

  async run() {
    const api = new QualtricsService();
    const { args, flags } = this.parse(SurveyCommand);

    switch (args.subcommand) {
      case SubCommand.Get:
        if (!args.surveyId) {
          this.error("`get` command requires a survey identifier");
        }
        api.getSurvey(args.surveyId).then(survey => {
          if (flags.verbose) {
            this.log(JSON.stringify(survey, null, 2));
          } else {
            this.log(survey.name);
          }
        });
        break;
      case SubCommand.List:
        api.listSurveys().then(surveyList => {
          const elements: QualtricsSurveyMetadata[] = surveyList.elements;
          const headers = ["Id", "Name", "Last Modified"].map(hdr =>
            chalk.greenBright(hdr)
          );
          const data = [[...headers]];
          const sortFn = flags["by-date"]
            ? (a: QualtricsSurveyMetadata, b: QualtricsSurveyMetadata) =>
                compareAsc(parse(a.lastModified), parse(b.lastModified))
            : (a: QualtricsSurveyMetadata, b: QualtricsSurveyMetadata) =>
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
