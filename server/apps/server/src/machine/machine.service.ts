import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "@server/src/shared/base.service";
import { Machine, MachineCreateInput } from "@server/src/machine/entities";
import { Repository } from "typeorm";

@Injectable()
export class MachineService extends BaseService<Machine> {
  constructor(
    @InjectRepository(Machine)
    protected readonly repo: Repository<Machine>
  ) {
    super(repo);
  }

  create(createInput: MachineCreateInput) {
    this.repo.save(this.repo.create(createInput));
  }

  readOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  readAll() {
    return this.repo.find();
  }

  delete(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}
