import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { ImageService } from "./image.service";
import { Int } from "@nestjs/graphql";
import { Image, ImageUpdateInput } from "./entities";
import { FileService } from "../file/file.service";
import { LetterElement } from "../letter/entities";
import { IMAGE_FILE_SERVICE } from "../file/file.module";
import { Inject, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/graphql-auth.guard";

@Resolver(() => Image)
@UseGuards(GqlAuthGuard)
export class ImageResolver {
  constructor(
    private readonly imageService: ImageService,
    @Inject(IMAGE_FILE_SERVICE) private readonly fileService: FileService
  ) {}

  // No createImage as that is handled by the upload controller.

  @Query(() => [Image])
  images() {
    return this.imageService.readAll();
  }

  @Query(() => Image)
  image(@Args({ name: "id", type: () => Int }) id: number) {
    return this.imageService.readOne(id);
  }

  @Mutation(() => Image)
  updateImage(@Args("updateInput") updateInput: ImageUpdateInput) {
    return this.imageService.update(updateInput);
  }

  @Mutation(() => Int)
  async deleteImage(@Args({ name: "id", type: () => Int }) id: number) {
    const imageDetails = await this.imageService.readOne(id);
    await this.fileService.deleteFile(imageDetails.fileName());
    return this.imageService.delete(id);
  }

  @ResolveField(() => String)
  url(@Parent() image: Image) {
    return `/images/${image.id}`;
  }

  @ResolveField(() => String)
  fullPath(@Parent() image: Image) {
    return this.fileService.absolutePath(image.fileName());
  }

  @ResolveField("letterElements", () => [LetterElement])
  resolveLetterElements(@Parent() image: Image) {
    return this.imageService.resolveLetterElements(image);
  }
}
