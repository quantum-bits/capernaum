import { LetterModule } from "./letter/letter.module";
import { QualtricsModule } from "./qualtrics/qualtrics.module";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    QualtricsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    }),
    LetterModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      entities: [
        "./**/*.entity.ts"
      ],
      synchronize: true
    })
  ]
})
export class AppModule {}
