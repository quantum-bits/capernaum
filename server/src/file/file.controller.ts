import { Controller, Get, Param, Res } from "@nestjs/common";
import { FileService } from "../file/file.service";

@Controller("pdfs")
export class ImageController {
  constructor(private readonly fileService: FileService) {}

  @Get(":fileName")
  async getFile(@Res() res, @Param("fileName") fileName: string) {
    const filePath = this.fileService.fullPath(fileName);
    const options = {
      headers: {
        "Content-Type": "application/pdf"
      }
    };
    res.sendFile(filePath, options);
  }
}
