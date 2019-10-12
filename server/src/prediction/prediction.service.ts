import { Injectable } from "@nestjs/common";
import {
  PredictionTable,
  PredictionTableEntry,
  PredictionTableUpdateInput,
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
    @InjectRepository(PredictionTable)
    private readonly predictionTableRepo: Repository<PredictionTable>,
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

  readAllPredictionTables() {
    return this.predictionTableRepo.find();
  }

  async updatePredictionTable(updateInput: PredictionTableUpdateInput) {
    const table = await this.predictionTableRepo.preload(updateInput);
    return this.predictionTableRepo.save(table);
  }

  async updateScriptureEngagementPractice(
    updateInput: ScriptureEngagementPracticeUpdateInput
  ) {
    const practice = await this.scriptureEngagementRepo.preload(updateInput);
    return this.scriptureEngagementRepo.save(practice);
  }
}
