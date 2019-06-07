import { Command, flags } from "@oclif/command";
import QualtricsAPI from "../../../api/src/QualtricsAPI";
import chalk from "chalk";
import { table } from "table";

export default class Org extends Command {
  static description = "get organization details";

  async run() {
    const api = new QualtricsAPI();

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
        console.log(table(data, options));
      });
    } else {
      throw new Error("No organization ID");
    }
  }
}
