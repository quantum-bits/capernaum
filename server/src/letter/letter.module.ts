import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Letter } from "./letter.entities";
import { LetterResolver } from "./letter.resolvers";
import { LetterService } from "./letter.service";

@Module({
  imports: [TypeOrmModule.forFeature([Letter])],
  providers: [LetterService, LetterResolver]
})
export class LetterModule {}
