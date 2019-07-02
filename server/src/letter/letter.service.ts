import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Letter } from "./letter.entity";

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>
  ) {}

  async findAll(): Promise<Letter[]> {
    return await this.letterRepository.find();
  }
}
