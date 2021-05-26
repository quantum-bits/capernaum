import dotenv from "dotenv";
dotenv.config();

import Knex from "knex";
const knex = Knex({
  client: "pg",
  connection: {
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
  },
});

import { Model } from "objection";
Model.knex(knex);

export { knex, Model };
