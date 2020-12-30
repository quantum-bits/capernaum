import { Module } from "@nestjs/common";
import { entities } from "@server/src/typeorm-config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupFabricatorService } from "./group-fabricator.service";
import { SurveyFabricatorService } from "@server/src/fabricator/survey-fabricator.service";
import { GroupModule } from "@server/src/group/group.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      logging: false,
      entities,
    }),
    GroupModule,
  ],
  providers: [GroupFabricatorService, SurveyFabricatorService],
  exports: [TypeOrmModule],
})
export class FabricatorModule {}
