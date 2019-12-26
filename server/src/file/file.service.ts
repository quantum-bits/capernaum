import { join, normalize } from "path";
import { access, close, open, unlink, write } from "fs";

interface FileDetails {
  fileName: string;
  fullPath: string;
  fileSize: number;
}

export class FileService {
  // Full path to static directory (e.g., '/home/capernaum/static')
  private readonly staticDirPath: string;

  // Full path to subdirectory (e.g., '/home/capernaum/static/pdfs')
  private readonly basePath: string;

  constructor(private readonly subDir: string) {
    this.staticDirPath = process.env.CAP_STATIC_DIR;
    this.basePath = normalize(join(this.staticDirPath, subDir));

    access(this.basePath, err => {
      if (err) {
        throw Error(`Can't find a base directory at '${this.basePath}'`);
      }
    });
  }

  baseDirPath() {
    return this.basePath;
  }

  relativePath(fileName: string) {
    return join(this.subDir, fileName);
  }

  fullPath(fileName: string) {
    return join(this.basePath, fileName);
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
