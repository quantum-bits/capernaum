import { Controller, Get, Inject, Param, Res } from "@nestjs/common";
import { FileService } from "../file/file.service";
import { PDF_FILE_SERVICE } from "../file/file.module";

@Controller("files")
export class PDFController {
  constructor(
    @Inject(PDF_FILE_SERVICE) private readonly pdfFileService: FileService
  ) {}

  @Get(":fileName")
  async getFile(@Res() res, @Param("fileName") fileName: string) {
    const filePath = this.pdfFileService.absolutePath(fileName);
    const options = {
      headers: {
        "Content-Type": "application/pdf"
      }
    };
    res.sendFile(filePath, options);
  }
}
