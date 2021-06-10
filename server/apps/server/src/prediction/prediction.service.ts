import { Injectable } from "@nestjs/common";
import {
  PredictionTableEntry,
  PredictionTableEntryCreateInput,
  PredictionTableEntryReplaceInput,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput,
  ScriptureEngagementPracticeUpdateInput,
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  PredictionTable,
  PredictionTableCreateInput,
  PredictionTableUpdateInput,
} from "@server/src/prediction/entities/prediction-table";
import { BaseService } from "@server/src/shared/base.service";

@Injectable()
export class PredictionTableService {
  constructor(
    @InjectRepository(PredictionTable)
    private readonly repo: Repository<PredictionTable>
  ) {}

  create(createInput: PredictionTableCreateInput) {
    return this.repo.save(this.repo.create(createInput));
  }

  readAll() {
    return this.repo.find();
  }

  update(updateInput: PredictionTableUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  delete(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}

@Injectable()
export class PredictionTableEntryService extends BaseService<PredictionTableEntry> {
  constructor(
    @InjectRepository(PredictionTableEntry)
    private readonly repo: Repository<PredictionTableEntry>
  ) {
    super(repo);
  }

  construct(createInput: PredictionTableEntryCreateInput) {
    this.repo.save(this.repo.create(createInput));
  }

  resolveSurveyIndex(predictionTableEntry: PredictionTableEntry) {
    return super.resolveOne(predictionTableEntry, "surveyIndex");
  }

  resolveScriptureEngagementPractice(
    predictionTableEntry: PredictionTableEntry
  ) {
    return super.resolveOne(predictionTableEntry, "practice");
  }

  replacePredictionTableEntries(
    replaceInput: PredictionTableEntryReplaceInput
  ): Promise<PredictionTableEntry[]> {
    return this.repo.manager.transaction(async (manager) => {
      const predictionTableEntryRepo =
        manager.getRepository(PredictionTableEntry);

      // Insert the replacement entries.
      const newEntries: PredictionTableEntry[] = [];
      for (const inputEntry of replaceInput.entries) {
        const entry = predictionTableEntryRepo.create({
          ...inputEntry,
        });
        newEntries.push(await predictionTableEntryRepo.save(entry));
      }

      return newEntries;
    });
  }
}

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

  readOne(id: number) {
    return this.repo.findOne(id);
  }

  readAll() {
    return this.repo.find();
  }

  resolvePredictionTableEntries(practice: ScriptureEngagementPractice) {
    return super.resolveMany(practice, "predictionTableEntries");
  }

  update(
    updateInput: ScriptureEngagementPracticeUpdateInput
  ): Promise<ScriptureEngagementPractice> {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  deconstruct(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}
