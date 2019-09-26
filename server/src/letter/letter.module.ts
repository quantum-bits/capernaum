import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Letter,
  LetterElement,
  LetterElementType,
  SurveyLetter
} from "./entities";
import {
  LetterElementTypeResolver,
  LetterResolver,
  SurveyLetterResolver
} from "./letter.resolvers";
import { LetterService } from "./letter.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      LetterElement,
      LetterElementType,
      SurveyLetter
    ])
  ],
  providers: [
    LetterService,
    LetterResolver,
    LetterElementTypeResolver,
    SurveyLetterResolver
  ]
})
export class LetterModule {}
