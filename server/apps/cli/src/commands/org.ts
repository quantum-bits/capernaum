import { QualtricsApiService } from "@qapi/qualtrics-api.service";
import { table } from "table";

export function showOrg() {
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
        console.log(table(data, options));
      })
      .catch((error) => console.error(error));
  } else {
    throw new Error("No organization ID");
  }
}
