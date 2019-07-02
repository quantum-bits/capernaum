import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Letter } from "./letter.entities";

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>
  ) {}

  findAll() {
    return this.letterRepository.find();
  }

  createLetter(name: string) {
    const newLetter = this.letterRepository.create({ name });
    return this.letterRepository.save(newLetter);
  }
}
