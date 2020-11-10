import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Group,
  Letter,
  LetterElement,
  LetterElementType,
  LetterType,
} from "./entities";
import {
  GroupResolver,
  LetterElementResolver,
  LetterElementTypeResolver,
  LetterResolver,
  LetterTypeResolver,
} from "./letter.resolvers";
import {
  GroupService,
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
      Group,
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
    GroupService,
    GroupResolver,
    LetterElementTypeService,
  ],
  exports: [LetterService],
})
export class LetterModule {}
