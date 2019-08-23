import { Injectable } from "@nestjs/common";
import {
  PredictionTable,
  PredictionTableCreateInput,
  PredictionTableUpdateInput,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput,
  ScriptureEngagementPracticeUpdateInput
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(PredictionTable)
    private readonly predictionTableRepo: Repository<PredictionTable>,
    @InjectRepository(ScriptureEngagementPractice)
    private readonly scriptureEngagementRepo: Repository<
      ScriptureEngagementPractice
    >
  ) {}

  createPredictionTable(createInput: PredictionTableCreateInput) {
    return this.predictionTableRepo.save(
      this.predictionTableRepo.create(createInput)
    );
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

  readAllScriptureEngagementPractices() {
    return this.scriptureEngagementRepo.find();
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
