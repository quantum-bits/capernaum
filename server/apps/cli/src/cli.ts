import { build } from "gluegun";
import { config } from "dotenv";

config();

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  // create a CLI runtime
  const cli = build()
    .brand("cap-cli")
    .src(__dirname)
    // .plugins("./node_modules", { matching: "cap-cli-*", hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    // enable the following method if you'd like to skip loading one of these core extensions
    // this can improve performance if they're not necessary for your project:
    .exclude([
      // "meta",
      "strings",
      // "print",
      // "filesystem",
      // "semver",
      "system",
      "prompt",
      "http",
      "template",
      "patching",
      "package-manager",
    ])
    .create();

  // run it and send it back (for testing, mostly)
  return await cli.run(argv);
}

module.exports = { run };
