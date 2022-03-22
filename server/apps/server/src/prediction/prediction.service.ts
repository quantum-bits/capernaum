import { Injectable } from "@nestjs/common";
import {
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput,
  ScriptureEngagementPracticeUpdateInput,
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "@server/src/shared/base.service";

@Injectable()
export class ScriptureEngagementPracticeService extends BaseService<ScriptureEngagementPractice> {
  constructor(
    @InjectRepository(ScriptureEngagementPractice)
    private readonly repo: Repository<ScriptureEngagementPractice>
  ) {
    super(repo);
  }

  create(createInput: ScriptureEngagementPracticeCreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  alwaysRelate = ["surveyIndices"];

  readOne(id: number): Promise<ScriptureEngagementPractice> {
    return this.repo.findOne({
      where: { id },
      relations: this.alwaysRelate,
    });
  }

  readAll() {
    return this.repo.find({ relations: this.alwaysRelate });
  }

  update(
    updateInput: ScriptureEngagementPracticeUpdateInput
  ): Promise<ScriptureEngagementPractice> {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  delete(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}
