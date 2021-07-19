import { Module } from "@nestjs/common";
import { FileService } from "./file.service";

export const IMAGE_FILE_SERVICE = "IMAGE_FILE_SERVICE";
export const REPORT_FILE_SERVICE = "PDF_FILE_SERVICE";

@Module({
  providers: [
    {
      provide: IMAGE_FILE_SERVICE,
      useFactory: () => new FileService(process.env.CAP_UPLOAD_REL_DIR),
    },
    {
      provide: REPORT_FILE_SERVICE,
      useFactory: () => new FileService(process.env.CAP_PDF_REL_DIR),
    },
  ],
  exports: [IMAGE_FILE_SERVICE, REPORT_FILE_SERVICE],
})
export class FileModule {}
