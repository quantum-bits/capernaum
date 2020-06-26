import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { ReporterModule } from "../src/reporter.module";

describe("AppController (e2e)", () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ReporterModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /*
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
   */
});
