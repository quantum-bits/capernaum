import { ImageController } from "./image.controller";
import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { FileService } from "./file.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "./entities";
import { ImageResolver } from "./image.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImageController],
  providers: [ImageResolver, ImageService, FileService]
})
export class ImageModule {}
