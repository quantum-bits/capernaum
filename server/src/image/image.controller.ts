import {
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "../file/file.service";
import { ImageService } from "./image.service";
import { Image } from "./entities";
import getRawBody from "raw-body";

@Controller("images")
export class ImageController {
  constructor(
    private readonly fileService: FileService,
    private readonly imageService: ImageService
  ) {}

  @Post("process")
  @Header("Content-Type", "text/plain")
  @UseInterceptors(FileInterceptor("filepondUpload"))
  async process(@UploadedFile() file): Promise<number> {
    const imageDetails = await this.imageService.createImage(
      file.originalname,
      file.mimetype
    );
    await this.fileService.saveFile(imageDetails.fileName(), file.buffer);
    return imageDetails.id;
  }

  @Get(":id")
  async getImage(@Res() res, @Param("id") id: number) {
    const imageDetails = await this.imageService.findOne(Image, id);
    const imagePath = this.fileService.fullPath(imageDetails.fileName());
    const options = {
      headers: {
        "Content-Type": imageDetails.mimeType
      }
    };
    res.sendFile(imagePath, options);
  }

  @Delete()
  deleteImage(@Req() req) {
    getRawBody(req)
      .then(async body => {
        const id = parseInt(body.toString());
        const imageDetails = await this.imageService.findOne(Image, id);

        await this.fileService.deleteFile(imageDetails.fileName());
        await this.imageService.delete(Image, id);
      })
      .catch(err => {
        throw err;
      });
  }
}
