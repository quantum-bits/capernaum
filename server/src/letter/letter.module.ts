import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letter, LetterElementType } from "./letter.entities";
import { LetterResolver } from "./letter.resolvers";
import { LetterElementTypeService, LetterService } from "./letter.service";

@Module({
  imports: [TypeOrmModule.forFeature([Letter, LetterElementType])],
  providers: [LetterService, LetterResolver, LetterElementTypeService]
})
export class LetterModule {}
