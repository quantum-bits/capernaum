import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letter, LetterElementType } from "./entities";
import { LetterElementTypeResolver, LetterResolver } from "./letter.resolvers";
import { LetterElementTypeService, LetterService } from "./letter.service";

@Module({
  imports: [TypeOrmModule.forFeature([Letter, LetterElementType])],
  providers: [
    LetterService,
    LetterResolver,
    LetterElementTypeService,
    LetterElementTypeResolver
  ]
})
export class LetterModule {}
