import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Letter,
  LetterElement,
  LetterElementType,
  LetterType,
} from "./entities";
import {
  LetterElementResolver,
  LetterElementTypeResolver,
  LetterResolver,
  LetterTypeResolver,
} from "./letter.resolvers";
import {
  LetterElementTypeService,
  LetterService,
  LetterTypeService,
} from "./letter.service";
import { PredictionTableEntry } from "../prediction/entities";
import { SurveyModule } from "@server/src/survey/survey.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      LetterType,
      LetterElement,
      LetterElementType,
      PredictionTableEntry,
    ]),
    SurveyModule,
  ],
  providers: [
    LetterService,
    LetterResolver,
    LetterElementResolver,
    LetterElementTypeResolver,
    LetterElementResolver,
    LetterTypeService,
    LetterTypeResolver,
    LetterElementTypeService,
  ],
  exports: [LetterService],
})
export class LetterModule {}
