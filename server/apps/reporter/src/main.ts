import { NestFactory } from "@nestjs/core";
import { ReporterModule } from "./reporter.module";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(ReporterModule);
}

bootstrap();
