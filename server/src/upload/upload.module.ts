import { UploadController } from "./upload.controller";
import { Module } from "@nestjs/common";

@Module({
  controllers: [UploadController]
})
export class UploadModule {}
