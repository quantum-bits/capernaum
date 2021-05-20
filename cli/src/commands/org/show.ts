import { Command } from "@oclif/command";
import { table } from "table";
import { QualtricsApiService } from "../../../../server/libs/qualtrics-api";

export default class OrgShow extends Command {
  static description = "show Qualtrics organization";

  async run() {
    const qualtricsService = new QualtricsApiService();

    if (process.env.QUALTRICS_ORG_ID) {
      qualtricsService
        .getOrganization(process.env.QUALTRICS_ORG_ID)
        .then((organization) => {
          const data = [
            ["Id", organization.id],
            ["Name", organization.name],
            ["Type", organization.type],
            ["Status", organization.status],
          ];
          const options = {
            drawHorizontalLine: (index: number, size: number) => {
              return index === 0 || index === size;
            },
          };
          this.log(table(data, options));
        })
        .catch((error) => this.error(error));
    } else {
      throw new Error("No organization ID");
    }
  }
}
