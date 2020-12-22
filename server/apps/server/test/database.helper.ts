import Knex from "knex";
import { Model } from "objection";

import dotenv from "dotenv";
dotenv.config();

const knex = Knex({
  client: "pg",
  connection: {
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
  },
});

Model.knex(knex);
