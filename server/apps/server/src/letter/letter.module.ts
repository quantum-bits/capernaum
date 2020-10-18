import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group, Letter, LetterElement, LetterElementType } from "./entities";
import {
  GroupResolver,
  LetterElementResolver,
  LetterElementTypeResolver,
  LetterResolver,
} from "./letter.resolvers";
import { GroupService, LetterService } from "./letter.service";
import { PredictionTableEntry } from "../prediction/entities";
import { SurveyModule } from "@server/src/survey/survey.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
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
    LetterElementTypeResolver,
    LetterElementResolver,
    GroupService,
    GroupResolver,
  ],
  exports: [LetterService],
})
export class LetterModule {}
