import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group, GroupCreateInput, GroupUpdateInput } from "./entities";

@Injectable()
export class GroupService extends BaseService {
  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>
  ) {
    super();
  }

  createGroup(createInput: GroupCreateInput): Promise<Group> {
    return this.groupRepo.save(this.groupRepo.create(createInput));
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
