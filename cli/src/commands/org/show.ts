import { GluegunToolbox } from 'gluegun'
import { QualtricsApiService } from '@qapi/qualtrics-api.service'

export default {
  run: async (toolbox: GluegunToolbox) => {
    const qualtricsService = new QualtricsApiService()

    if (process.env.QUALTRICS_ORG_ID) {
      qualtricsService
        .getOrganization(process.env.QUALTRICS_ORG_ID)
        .then((organization) => {
          const data = [
            ['Id', organization.id],
            ['Name', organization.name],
            ['Type', organization.type],
            ['Status', organization.status],
          ]
          // const options = {
          //   drawHorizontalLine: (index: number, size: number) => {
          //     return index === 0 || index === size
          //   },
          // }
          toolbox.print.table(data, { format: 'lean' })
        })
        .catch((error) => toolbox.print.error(error))
    } else {
      throw new Error('No organization ID')
    }
  },
}
