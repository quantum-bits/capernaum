import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class GenericService<EntityType, InputType> {
  constructor(private readonly genericRepository: Repository<EntityType>) {}

  create(input: InputType) {
    const newGeneric = this.genericRepository.create(input);
    return this.genericRepository.save(newGeneric);
  }

  readOne(id: number) {
    return this.genericRepository.findOne(id);
  }

  readAll() {
    return this.genericRepository.find();
  }

  delete(id: number) {
    return this.genericRepository.delete(id);
  }
}
