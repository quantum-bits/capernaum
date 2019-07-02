import { QualtricsModule } from "./qualtrics/qualtrics.module";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

@Module({
  imports: [
    QualtricsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    })
  ]
})
export class AppModule {}
