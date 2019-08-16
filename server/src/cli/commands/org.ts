import { Command } from "@oclif/command";
import { QualtricsService } from "../../qualtrics/qualtrics.service";
import { table } from "table";

export default class OrgCommand extends Command {
  static description = "get organization details";

  async run() {
    const api = new QualtricsService();

    if (process.env.CAP_ORG_ID) {
      api.getOrganization(process.env.CAP_ORG_ID).then(response => {
        const result = response.data.result;
        const data = [
          ["Id", result.id],
          ["Name", result.name],
          ["Type", result.type],
          ["Status", result.status]
        ];
        const options = {
          drawHorizontalLine: (index: number, size: number) => {
            return index === 0 || index === size;
          }
        };
        this.log(table(data, options));
      });
    } else {
      throw new Error("No organization ID");
    }
  }
}
