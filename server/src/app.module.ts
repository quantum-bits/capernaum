import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LetterModule } from "./letter/letter.module";
import { QualtricsModule } from "./qualtrics/qualtrics.module";
import { Letter } from "./letter/letter.entities";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      entities: [Letter],
      synchronize: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    }),
    LetterModule,
    QualtricsModule
  ]
})
export class AppModule {}
