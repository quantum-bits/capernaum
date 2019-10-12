import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letter, LetterElement, LetterElementType } from "./entities";
import {
  LetterElementTypeResolver,
  LetterResolver,
  LetterElementResolver
} from "./letter.resolvers";
import { LetterService } from "./letter.service";
import { PredictionTableEntry } from "../prediction/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      LetterElement,
      LetterElementType,
      PredictionTableEntry
    ])
  ],
  providers: [
    LetterService,
    LetterResolver,
    LetterElementTypeResolver,
    LetterElementResolver
  ]
})
export class LetterModule {}
