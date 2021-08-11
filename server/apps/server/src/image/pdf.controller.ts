import {
  Controller,
  Get,
  Inject,
  Param,
  Response,
} from "@nestjs/common";
import { FileService } from "../file/file.service";
import { REPORT_FILE_SERVICE } from "../file/file.module";
import { join } from "path";
import { getDebugger } from "@helpers/debug-factory";

const debug = getDebugger("pdf");

@Controller("files")
export class PDFController {
  constructor(
    @Inject(REPORT_FILE_SERVICE) private readonly pdfFileService: FileService
  ) {}

  @Get(":survey/:subDir/:fileName")
  async getFile(@Response() response, @Param() params) {
    const filePath = this.pdfFileService.absolutePath(
      join(params.survey, params.subDir, params.fileName)
    );
    const options = {
      headers: {
        "Content-Type": "application/pdf",
      },
    };
    debug("getFile %O", {
      params,
      filePath,
    });
    response.sendFile(filePath, options);
  }
}
