import { GluegunToolbox } from 'gluegun'
import { NestFactory } from '@nestjs/core'
import { CliModule } from '../cli.module'

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
  let cachedApp = undefined

  toolbox.getNestApp = async () => {
    console.log('GET')
    if (!cachedApp) {
      cachedApp = await NestFactory.createApplicationContext(CliModule)
    }
    console.log('CACHED', cachedApp)
    return cachedApp
  }

  // enable this if you want to read configuration in from
  // the current folder's package.json (in a "cap-cli" property),
  // cap-cli.config.json, etc.
  // toolbox.config = {
  //   ...toolbox.config,
  //   ...toolbox.config.loadConfig("cap-cli", process.cwd())
  // }
}
