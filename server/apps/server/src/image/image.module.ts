import { ImageController } from "./image.controller";
import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "./entities";
import { ImageResolver } from "./image.resolver";
import { FileModule } from "../file/file.module";
import { PDFController } from "./pdf.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Image]), FileModule],
  controllers: [ImageController, PDFController],
  providers: [ImageResolver, ImageService],
})
export class ImageModule {}
