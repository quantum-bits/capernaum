import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group, GroupCreateInput, GroupUpdateInput } from "./entities";
import { CodeWord } from "@server/src/group/code-word";

@Injectable()
export class GroupService extends BaseService {
  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>
  ) {
    super();
  }

  createGroup(createInput: GroupCreateInput): Promise<Group> {
    const codeWord = CodeWord.generate();
    return this.groupRepo.save(
      this.groupRepo.create({
        ...createInput,
        codeWord,
      })
    );
  }

  readGroups(): Promise<Group[]> {
    return this.groupRepo.find({ relations: ["survey"] });
  }

  readGroup(id: number): Promise<Group> {
    return this.groupRepo.findOne(id, {
      relations: ["survey", "surveyResponses"],
    });
  }

  updateGroup(updateInput: GroupUpdateInput): Promise<Group> {
    return this.groupRepo
      .preload(updateInput)
      .then((result) => this.groupRepo.save(result));
  }
}
