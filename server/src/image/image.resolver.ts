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

@Resolver(of => Image)
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

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
  deleteImage(@Args({ name: "id", type: () => Int }) id: number) {
    return this.imageService.delete(Image, id);
  }

  @ResolveProperty(returns => String)
  url(@Parent() image) {
    return `http://localhost:3000/images/${image.id}`;
  }
}
