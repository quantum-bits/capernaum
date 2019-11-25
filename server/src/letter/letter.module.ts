import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letter, LetterElement, LetterElementType } from "./entities";
import {
  LetterElementResolver,
  LetterElementTypeResolver,
  LetterResolver
} from "./letter.resolvers";
import { LetterService } from "./letter.service";
import { PredictionTableEntry } from "../prediction/entities";
import { SurveyModule } from "../survey/survey.module";
import { ImageModule } from "../image/image.module";
import LetterWriter from "./letter.writer";
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      LetterElement,
      LetterElementType,
      PredictionTableEntry
    ]),
    SurveyModule,
    ImageModule,
    FileModule
  ],
  providers: [
    LetterService,
    LetterResolver,
    LetterElementTypeResolver,
    LetterElementResolver,
    LetterWriter
  ]
})
export class LetterModule {}
