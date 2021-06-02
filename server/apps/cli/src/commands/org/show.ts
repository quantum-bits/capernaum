import { GluegunCommand, GluegunToolbox } from "gluegun";
import { QualtricsApiService } from "@qapi/qualtrics-api.service";

export default {
  name: "show",
  alias: ["s"],
  description: "Show Qualtrics organization details",
  run: async (toolbox: GluegunToolbox) => {
    const qualtricsService = new QualtricsApiService();

    if (process.env.QUALTRICS_ORG_ID) {
      const spinner = toolbox.print.spin("Fetching org info");
      qualtricsService
        .getOrganization(process.env.QUALTRICS_ORG_ID)
        .then((organization) => {
          spinner.succeed("Done");
          const data = [
            ["Id", organization.id],
            ["Name", organization.name],
            ["Type", organization.type],
            ["Status", organization.status],
          ];
          // const options = {
          //   drawHorizontalLine: (index: number, size: number) => {
          //     return index === 0 || index === size
          //   },
          // }
          toolbox.print.table(data, { format: "lean" });
        })
        .catch((error) => toolbox.print.error(error));
    } else {
      throw new Error("No organization ID");
    }
  },
} as GluegunCommand;
