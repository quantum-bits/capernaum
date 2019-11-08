import { Injectable } from "@nestjs/common";
import { join, normalize } from "path";
import { access, close, open, write } from "fs";
import { v4 } from "uuid";

interface FileDetails {
  fullPath: string;
  uuid: string;
  mimeType: string;
  fileSize: number;
}

@Injectable()
export class FileService {
  private readonly fileBaseDir: string;

  constructor() {
    const workingDir = process.cwd();
    const uploadBaseDir = process.env.UPLOAD_BASE_DIR;
    this.fileBaseDir = normalize(join(workingDir, uploadBaseDir));

    access(this.fileBaseDir, err => {
      if (err) {
        throw Error(`No base upload directory at '${this.fileBaseDir}'`);
      }
    });
  }

  private extensionFromMimeType(mimeType: string) {
    return mimeType.replace(/\//g, ".");
  }

  private fileName(uuid: string, mimeType: string) {
    return `${uuid}.${this.extensionFromMimeType(mimeType)}`;
  }

  private fullPath(uuid: string, mimeType: string) {
    return join(this.fileBaseDir, this.fileName(uuid, mimeType));
  }

  async saveFile(mimeType: string, buffer: Buffer): Promise<FileDetails> {
    const uuid = v4();
    const fullPath = this.fullPath(uuid, mimeType);

    return new Promise((resolve, reject) => {
      let fileSize = NaN;

      open(fullPath, "w", (err, fd) => {
        if (err) {
          reject(Error(`Upload file '${fullPath}' already exists`));
        }

        write(fd, buffer, (err, bytesWritten) => {
          if (err) {
            reject(Error(`Failed to write '${fullPath}'`));
          }
          fileSize = bytesWritten;
        });

        close(fd, err => {
          if (err) {
            reject(Error(`Failed to close '${fullPath}'`));
          }

          resolve({
            fullPath,
            uuid,
            mimeType,
            fileSize
          });
        });
      });
    });
  }

  loadFile(uuid: string) {}
}
