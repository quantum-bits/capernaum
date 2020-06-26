import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { EntityManager, Repository } from "typeorm";
import { Image } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";

import { v4 } from "uuid";

@Injectable()
export class ImageService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Image)
    protected readonly imageRepo: Repository<Image>
  ) {
    super(entityManager);
  }

  async createImage(originalName: string, mimeType: string) {
    const uuid = v4();

    return this.imageRepo.save(
      this.imageRepo.create({
        originalName,
        mimeType,
        uuid
      })
    );
  }
}
