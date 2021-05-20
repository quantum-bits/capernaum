import { Command, flags } from "@oclif/command";
import { QualtricsApiService } from "../../../../server/libs/qualtrics-api";

export default class SurveyGet extends Command {
  static description = "get survey by ID";

  static flags = {
    verbose: flags.boolean({ char: "v", description: "verbose output" }),
  };

  static args = [
    { name: "surveyId", required: true, description: "survey ID (SV_...)" },
  ];

  async run() {
    const { flags, args } = this.parse(SurveyGet);
    const qualtricsService = new QualtricsApiService();

    qualtricsService.getSurvey(args.surveyId).then((survey) => {
      if (flags.verbose) {
        this.log(JSON.stringify(survey, null, 2));
      } else {
        this.log(survey.name);
      }
    });
  }
}
