import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CliModule } from "@common/cli/src/cli.module";
import { Type } from "@nestjs/common/interfaces/type.interface";

export default class NestContext {
  private app: INestApplicationContext = null;

  private async cacheNestContext() {
    if (!this.app) {
      this.app = await NestFactory.createApplicationContext(CliModule);
    }
  }

  async get<T>(typeOrToken: Type<T>): Promise<T> {
    await this.cacheNestContext();
    return this.app.get(typeOrToken);
  }

  async close() {
    if (!this.app) {
      throw Error("App context not cached");
    }
    await this.app.close();
    this.app = null;
  }
}
