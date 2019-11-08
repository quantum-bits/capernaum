import {
  Controller,
  Header,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "./file.service";
import { ImageService } from "./image.service";

@Controller("upload")
export class ImageController {
  constructor(
    private readonly fileService: FileService,
    private readonly imageService: ImageService
  ) {}

  @Post("process")
  @Header("Content-Type", "text/plain")
  @UseInterceptors(FileInterceptor("filepondUpload"))
  async process(@UploadedFile() file): Promise<number> {
    const fileDetails = await this.fileService.saveFile(
      file.mimetype,
      file.buffer
    );

    const result = await this.imageService.createImage(
      file.originalname,
      file.mimetype,
      fileDetails.uuid
    );

    return result.id;
  }
}
