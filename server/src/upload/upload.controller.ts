import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 } from "uuid";

@Controller("upload")
export class UploadController {
  @Post("process")
  @UseInterceptors(FileInterceptor("filepondUpload"))
  process(@UploadedFile() file) {
    const uniqueId = v4();
    console.log("FILE", file);
    console.log("UUID", uniqueId);
    return "12345";
  }
}
