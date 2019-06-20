import { QualtricsModule } from "./qualtrics/qualtrics.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GraphQLModule } from "@nestjs/graphql";

@Module({
  imports: [
    QualtricsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql"
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
