import { Hook } from "@oclif/config";

import { config } from "dotenv";

const hook: Hook<"init"> = async function(opts) {
  config(); // Import configuration to environment.
};

export default hook;
