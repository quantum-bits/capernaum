import { join, normalize } from "path";
import { access, close, open, unlink, write } from "fs";

interface FileDetails {
  fileName: string;
  fullPath: string;
  fileSize: number;
}

export class FileService {
  // Relative dir (e.g., 'static/pdfs' or 'static/images')
  private readonly relDir: string;

  // Absolute dir (e.g., '/home/capernaum/static/pdfs')
  private readonly absDir: string;

  constructor(private readonly subDir: string) {
    // Top-level capernaum base path (e.g., '/home/capernaum')
    const baseAbsDir = normalize(process.env.CAP_BASE_ABS_DIR);

    this.relDir = normalize(join(process.env.CAP_STATIC_REL_DIR, subDir));
    this.absDir = normalize(join(baseAbsDir, this.relDir));

    access(this.absDir, err => {
      if (err) {
        throw Error(`Can't find a base directory at '${this.absDir}'`);
      }
    });
  }

  absoluteDir() {
    return this.relDir;
  }

  relativePath(fileName: string) {
    return join(this.relDir, fileName);
  }

  absolutePath(fileName: string) {
    return join(this.absDir, fileName);
  }

  async saveFile(fileName: string, buffer: Buffer): Promise<FileDetails> {
    const fullPath = this.absolutePath(fileName);

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
    const fullPath = this.absolutePath(fileName);

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
