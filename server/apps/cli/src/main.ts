import { NestFactory } from "@nestjs/core";
import { CliModule } from "./cli.module";

async function bootstrap() {
  const app = await NestFactory.create(CliModule);
  await app.listen(3000);
}
bootstrap();
