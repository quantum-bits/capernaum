import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";
import { INestApplication } from "@nestjs/common";
import dotenv from "dotenv";

dotenv.config({ path: ".testing.env" });

describe("Group GraphQL (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it("queries all users", () => {
    return request(app.getHttpServer())
      .post("/graphql")
      .auth(process.env.JWT, { type: "bearer" })
      .accept("json")
      .send({
        query: "query AllUsers { users { id firstName lastName } }",
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.users).toHaveLength(4);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
