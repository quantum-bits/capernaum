import { Command, flags } from "@oclif/command";
import QualtricsAPI from "../../../api/src/QualtricsAPI";
import chalk from "chalk";
import { table } from "table";
import { format, parse, compareAsc } from "date-fns";
import { gunzipSync, unzipSync } from "zlib";

interface ListSurveysResult {
  id: string;
  isActive: boolean;
  lastModified: string;
  name: string;
  ownerId: string;
}

const enum SubCommand {
  Create = "create",
  Check = "check",
  Get = "get"
}

export default class Response extends Command {
  static description = "get survey response(s)";

  static args = [
    {
      name: "subcommand",
      description: "response action",
      required: true,
      options: [SubCommand.Create, SubCommand.Check, SubCommand.Get]
    },
    {
      name: "surveyId",
      description: "Survey identifier",
      required: true
    },
    {
      name: "extraId",
      description: "Progress identifier (check) or file identifier (get)"
    }
  ];

  async run() {
    const api = new QualtricsAPI();
    const { args, flags } = this.parse(Response);

    switch (args.subcommand) {
      case SubCommand.Create:
        api
          .createResponseExport(args.surveyId)
          .then(response => this.log(response.data));
        break;
      case SubCommand.Check:
        if (!args.extraId) {
          throw new Error("No progress identifier");
        }
        api
          .getResponseExportProgress(args.surveyId, args.extraId)
          .then(response => this.log(response.data));
        break;
      case SubCommand.Get:
        api
          .getResponseExportFile(args.surveyId, args.extraId)
          .then(entries => console.log("ENTRIES", entries))
          .catch(err => this.error(err));
        break;
    }
  }
}
