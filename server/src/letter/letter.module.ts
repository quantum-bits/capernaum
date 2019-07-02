import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { LetterService } from "./letter.service";
import { Letter } from "./letter.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Letter])],
  providers: [LetterService]
})
export class LetterModule {}
