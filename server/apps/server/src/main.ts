import { config } from "dotenv";
config();

import PrettyError = require("pretty-error");
PrettyError.start();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

bootstrap()
  .then(() => console.log("Capernaum started successfully"))
  .catch((error) => console.error(`Failed: ${error}`));
