import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letter, LetterElement, LetterElementType } from "./entities";
import { LetterElementTypeResolver, LetterResolver } from "./letter.resolvers";
import { LetterService } from "./letter.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Letter, LetterElement, LetterElementType])
  ],
  providers: [LetterService, LetterResolver, LetterElementTypeResolver]
})
export class LetterModule {}
