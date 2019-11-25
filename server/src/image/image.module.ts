import { ImageController } from "./image.controller";
import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "./entities";
import { ImageResolver } from "./image.resolver";
import { FileModule } from "../file/file.module";

@Module({
  imports: [TypeOrmModule.forFeature([Image]), FileModule],
  controllers: [ImageController],
  providers: [ImageResolver, ImageService]
})
export class ImageModule {}
