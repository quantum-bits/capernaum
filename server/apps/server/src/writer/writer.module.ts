import { Module } from "@nestjs/common";
import { WriterService } from "./writer.service";
import { SurveyModule } from "../survey/survey.module";
import { LetterModule } from "../letter/letter.module";
import { ImageModule } from "../image/image.module";
import { FileModule } from "../file/file.module";
import { WriterResolver } from "./writer.resolvers";
import { GroupModule } from "@server/src/group/group.module";
import { VisualizationModule } from "@server/src/visualization/visualization.module";

@Module({
  imports: [
    LetterModule,
    ImageModule,
    FileModule,
    GroupModule,
    SurveyModule,
    VisualizationModule,
  ],
  providers: [WriterService, WriterResolver],
  exports: [WriterService],
})
export class WriterModule {}
