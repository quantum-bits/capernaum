import { Injectable } from "@nestjs/common";
import { join, normalize } from "path";
import { access, close, open, unlink, write } from "fs";

interface FileDetails {
  fileName: string;
  fullPath: string;
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

  fullPath(fileName: string) {
    return join(this.fileBaseDir, fileName);
  }

  async saveFile(fileName: string, buffer: Buffer): Promise<FileDetails> {
    const fullPath = this.fullPath(fileName);

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
            fileName,
            fullPath,
            fileSize
          });
        });
      });
    });
  }

  deleteFile(fileName: string) {
    const fullPath = this.fullPath(fileName);

    return new Promise((resolve, reject) => {
      unlink(fullPath, err => {
        if (err) {
          reject(err);
        }
        resolve(fullPath);
      });
    });
  }
}
