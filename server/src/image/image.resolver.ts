import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveProperty,
  Resolver
} from "@nestjs/graphql";
import { ImageService } from "./image.service";
import { Int } from "type-graphql";
import { Image, ImageUpdateInput } from "./entities";
import { FileService } from "../file/file.service";
import { LetterElement } from "../letter/entities";

@Resolver(of => Image)
export class ImageResolver {
  constructor(
    private readonly imageService: ImageService,
    private readonly fileService: FileService
  ) {}

  // No createImage as that is handled by the upload controller.

  @Query(returns => [Image])
  images() {
    return this.imageService.find(Image);
  }

  @Query(returns => Image)
  image(@Args({ name: "id", type: () => Int }) id: number) {
    return this.imageService.findOne(Image, id);
  }

  @Mutation(returns => Image)
  updateImage(@Args("updateInput") updateInput: ImageUpdateInput) {
    return this.imageService.update(Image, updateInput);
  }

  @Mutation(returns => Int)
  async deleteImage(@Args({ name: "id", type: () => Int }) id: number) {
    const imageDetails = await this.imageService.findOne(Image, id);
    await this.fileService.deleteFile(imageDetails.fileName());
    return this.imageService.delete(Image, id);
  }

  @ResolveProperty(returns => String)
  url(@Parent() image: Image) {
    return `http://localhost:3000/images/${image.id}`;
  }

  @ResolveProperty(returns => String)
  fullPath(@Parent() image: Image) {
    return this.fileService.fullPath(image.fileName());
  }

  @ResolveProperty("letterElements", type => [LetterElement])
  resolveLetterElements(@Parent() image: Image) {
    return this.imageService.find(LetterElement, { image });
  }
}
