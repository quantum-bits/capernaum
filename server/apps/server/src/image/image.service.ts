import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Image, ImageUpdateInput } from "./entities";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 } from "uuid";
import { BaseService } from "@server/src/shared/base.service";

@Injectable()
export class ImageService extends BaseService<Image> {
  constructor(
    @InjectRepository(Image)
    protected readonly repo: Repository<Image>
  ) {
    super(repo);
  }

  create(originalName: string, mimeType: string) {
    return this.repo.save(
      this.repo.create({
        originalName,
        mimeType,
        uuid: v4(),
      })
    );
  }

  readOne(id: number) {
    return this.repo.findOne(id);
  }

  readAll() {
    return this.repo.find();
  }

  resolveLetterElements(image: Image) {
    return this.resolveMany(image, "letterElements");
  }

  update(updateInput: ImageUpdateInput) {
    return this.repo
      .preload(updateInput)
      .then((result) => this.repo.save(result));
  }

  delete(id: number) {
    return this.repo.delete(id).then((result) => result.affected);
  }
}
