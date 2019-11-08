import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";
import { EntityManager, Repository } from "typeorm";
import { Image, ImageUpdateInput } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { FileService } from "./file.service";

@Injectable()
export class ImageService extends BaseService {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Image)
    protected readonly imageRepo: Repository<Image>
  ) {
    super(entityManager);
  }

  async createImage(originalName: string, mimeType: string, uuid: string) {
    return this.imageRepo.save(
      this.imageRepo.create({
        originalName,
        mimeType,
        uuid
      })
    );
  }

  async updateDetails(updateInput: ImageUpdateInput) {
    const result = await this.imageRepo.update(
      { uuid: updateInput.serverId },
      { title: updateInput.title }
    );
    return result.affected;
  }
}
