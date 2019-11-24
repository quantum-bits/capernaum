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
import { FileService } from "../image/file.service";
import { ImageModule } from "../image/image.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      LetterElement,
      LetterElementType,
      PredictionTableEntry
    ]),
    SurveyModule
  ],
  providers: [
    LetterService,
    LetterResolver,
    LetterElementTypeResolver,
    LetterElementResolver
  ]
})
export class LetterModule {}
