import { Injectable } from "@nestjs/common";
import { OldBaseService } from "../shared/old-base.service";
import { Repository } from "typeorm";
import { Image } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";

import { v4 } from "uuid";

@Injectable()
export class ImageService extends OldBaseService {
  constructor(
    @InjectRepository(Image)
    protected readonly imageRepo: Repository<Image>
  ) {
    super();
  }

  async createImage(originalName: string, mimeType: string) {
    const uuid = v4();

    return this.imageRepo.save(
      this.imageRepo.create({
        originalName,
        mimeType,
        uuid,
      })
    );
  }
}
