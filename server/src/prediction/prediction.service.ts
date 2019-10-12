import { Injectable } from "@nestjs/common";
import {
  PredictionTableEntry,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput,
  ScriptureEngagementPracticeUpdateInput
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { BaseService } from "../shared/base.service";

@Injectable()
export class PredictionService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(PredictionTableEntry)
    private readonly predictionTableEntryRepo: Repository<PredictionTableEntry>,
    @InjectRepository(ScriptureEngagementPractice)
    private readonly scriptureEngagementRepo: Repository<
      ScriptureEngagementPractice
    >
  ) {
    super(entityManager);
  }

  createScriptureEngagementPractice(
    createInput: ScriptureEngagementPracticeCreateInput
  ) {
    return this.scriptureEngagementRepo.save(
      this.scriptureEngagementRepo.create(createInput)
    );
  }

  async updateScriptureEngagementPractice(
    updateInput: ScriptureEngagementPracticeUpdateInput
  ) {
    const practice = await this.scriptureEngagementRepo.preload(updateInput);
    return this.scriptureEngagementRepo.save(practice);
  }
}
