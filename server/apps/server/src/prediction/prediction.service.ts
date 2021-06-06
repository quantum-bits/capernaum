import { Injectable } from "@nestjs/common";
import {
  PredictionTableEntry,
  PredictionTableEntryReplaceInput,
  ScriptureEngagementPractice,
  ScriptureEngagementPracticeCreateInput,
  ScriptureEngagementPracticeUpdateInput,
} from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../shared/base.service";
import {
  PredictionTable,
  PredictionTableCreateInput,
  PredictionTableUpdateInput,
} from "@server/src/prediction/entities/prediction-table";

@Injectable()
export class PredictionService extends BaseService {
  constructor(
    @InjectRepository(PredictionTableEntry)
    private readonly predictionTableEntryRepo: Repository<PredictionTableEntry>,
    @InjectRepository(ScriptureEngagementPractice)
    private readonly scriptureEngagementRepo: Repository<ScriptureEngagementPractice>
  ) {
    super();
  }

  replacePredictionTableEntries(
    replaceInput: PredictionTableEntryReplaceInput
  ): Promise<PredictionTableEntry[]> {
    return this.entityManager.transaction(async (manager) => {
      const predictionTableEntryRepo =
        manager.getRepository(PredictionTableEntry);

      // Remove all the old prediction table entries.
      await predictionTableEntryRepo.delete({
        letterId: replaceInput.letterId,
      });

      // Insert the replacement entries.
      const newEntries: PredictionTableEntry[] = [];
      for (const inputEntry of replaceInput.entries) {
        const entry = predictionTableEntryRepo.create({
          ...inputEntry,
          letterId: replaceInput.letterId,
        });
        newEntries.push(await predictionTableEntryRepo.save(entry));
      }

      return newEntries;
    });
  }

  async updateScriptureEngagementPractice(
    updateInput: ScriptureEngagementPracticeUpdateInput
  ): Promise<ScriptureEngagementPractice> {
    const practice = await this.scriptureEngagementRepo.preload(updateInput);
    return this.scriptureEngagementRepo.save(practice);
  }
}

@Injectable()
export class PredictionTableService {
  constructor(
    @InjectRepository(PredictionTable)
    private readonly predictiontableRepo: Repository<PredictionTable>
  ) {}

  createPredictionTable(createInput: PredictionTableCreateInput) {
    return this.predictiontableRepo.save(
      this.predictiontableRepo.create(createInput)
    );
  }

  readPredictionTables() {
    return this.predictiontableRepo.find();
  }

  updatePredictionTable(updateInput: PredictionTableUpdateInput) {
    return this.predictiontableRepo
      .preload(updateInput)
      .then((result) => this.predictiontableRepo.save(result));
  }

  deletePredictionTable(id: number) {
    return this.predictiontableRepo
      .delete(id)
      .then((result) => result.affected);
  }
}
