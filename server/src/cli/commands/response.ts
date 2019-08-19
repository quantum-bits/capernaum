import { Command, flags } from "@oclif/command";
import { QualtricsService } from "../../qualtrics/qualtrics.service";

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
  Get = "get",
  Complete = "complete"
}

export default class ResponseCommand extends Command {
  static description = "get survey response(s)";

  static args = [
    {
      name: "subcommand",
      description: "response action",
      required: true,
      options: [
        SubCommand.Create,
        SubCommand.Check,
        SubCommand.Get,
        SubCommand.Complete
      ]
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

  static flags = {
    startDate: flags.string({
      description:
        "Start date/time for responses (e.g., '2019-06-12', '2010-06-12T14:20Z')"
    }),
    endDate: flags.string({
      description: "End date/time for responses"
    })
  };

  async run() {
    const api = new QualtricsService();
    const { args, flags } = this.parse(ResponseCommand);

    switch (args.subcommand) {
      case SubCommand.Create:
        api
          .createResponseExport(args.surveyId, flags.startDate, flags.endDate)
          .then(response => this.log(JSON.stringify(response, null, 2)))
          .catch(err => this.error(err));
        break;

      case SubCommand.Check:
        if (!args.extraId) {
          throw new Error("No progress identifier");
        }
        api
          .getResponseExportProgress(args.surveyId, args.extraId)
          .then(progress => this.log(JSON.stringify(progress, null, 2)))
          .catch(err => this.error(err));
        break;

      case SubCommand.Get:
        api
          .getResponseExportFile(args.surveyId, args.extraId)
          .then(entries => {
            return entries.map(entry => ({
              fileName: entry.fileName,
              content: JSON.parse(entry.content)
            }));
          })
          .then(result => console.log(JSON.stringify(result, null, 2)))
          .catch(err => this.error(err));
        break;

      case SubCommand.Complete:
        api
          .getResponses(args.surveyId, flags.startDate, flags.endDate)
          .then(entries => console.log("ENTRIES", entries))
          .catch(err => this.error(err));
        break;
    }
  }
}
