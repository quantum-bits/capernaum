import { forwardRef, Module } from "@nestjs/common";
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
  LetterElementService,
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
    forwardRef(() => SurveyModule),
  ],
  providers: [
    LetterElementResolver,
    LetterElementService,
    LetterElementTypeResolver,
    LetterElementTypeService,
    LetterResolver,
    LetterService,
    LetterTypeResolver,
    LetterTypeService,
  ],
  exports: [LetterService, LetterTypeService, LetterElementService],
})
export class LetterModule {}
