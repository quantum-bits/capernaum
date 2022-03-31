import { config } from "dotenv";
config();

import PrettyError = require("pretty-error");
PrettyError.start();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3000);
}

const logger = new Logger("Main");

bootstrap()
  .then(() => logger.log("Capernaum bootstrapped successfully"))
  .catch((error) => logger.error(`Failed: ${error}`));
