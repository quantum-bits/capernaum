import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "./file.service";
import { ImageService } from "./image.service";
import { Image } from "./entities";

@Controller("images")
export class ImageController {
  constructor(
    private readonly fileService: FileService,
    private readonly imageService: ImageService
  ) {}

  @Get(":id")
  async getImage(@Res() res, @Param("id") id: number) {
    const imageDetails = await this.imageService.findOne(Image, id);
    const imagePath = this.fileService.fullPath(
      imageDetails.uuid,
      imageDetails.mimeType
    );
    const options = {
      headers: {
        "Content-Type": imageDetails.mimeType
      }
    };
    res.sendFile(imagePath, options);
  }

  @Post("process")
  @Header("Content-Type", "text/plain")
  @UseInterceptors(FileInterceptor("filepondUpload"))
  async process(@UploadedFile() file): Promise<string> {
    const fileDetails = await this.fileService.saveFile(
      file.mimetype,
      file.buffer
    );

    const result = await this.imageService.createImage(
      file.originalname,
      file.mimetype,
      fileDetails.uuid
    );

    return result.uuid;
  }
}
