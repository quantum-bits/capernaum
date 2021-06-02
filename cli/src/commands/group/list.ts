import { GluegunToolbox } from 'gluegun'
import { GroupService } from '@server/src/group/group.service'

module.exports = {
  run: async (toolbox: GluegunToolbox) => {
    toolbox.print.info('HELLO')
    const app = toolbox.getNestApp()
    const groupService = app.get(GroupService)
    const groups = groupService.readGroups()
    toolbox.print.info(groups)
  },
}
