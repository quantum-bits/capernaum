import { join, normalize } from "path";
import fs from "fs-extra";

interface FileDetails {
  fileName: string;
  fullPath: string;
  fileSize: number;
}

// Terminology:
//  abs - starts with a slash
//  rel - starts with a non-slash
//  dir - ends at a directory
// path - ends at a file

// /home/capernaum/static/pdfs/alpha/beta/foo.pdf
// /====/========= topLevelAbsDir
//                 ======/==== topLevelRelDir
//                             =====/==== workingRelDir
//                                        ===.=== fileName
// /====/=========/======/====/=====/==== absoluteDir
// /====/=========/======/====/=====/====/===.=== absolutePath(fileName)
//                 ======/====/=====/==== relativeDir
//                 ======/====/=====/====/===.=== relativePath(fileName)

export class FileService {
  private readonly topLevelAbsDir: string;
  private readonly topLevelRelDir: string;
  private workingRelDir = "";

  // The `subDir` is something like `images` or `pdfs`.
  constructor(private readonly subDir: string) {
    this.topLevelAbsDir = normalize(process.env.CAP_BASE_ABS_DIR);
    this.topLevelRelDir = join(process.env.CAP_STATIC_REL_DIR, subDir);

    // Make sure the directory is already there. Don't really want to
    // create it as its location is based on ENV configuration.
    const dir = join(this.topLevelAbsDir, this.topLevelRelDir);
    if (!fs.existsSync(dir)) {
      throw new Error(`Top-level directory '${dir}' doesn't exist`);
    }
  }

  /**
   * Set working directory. This is _stateful_, so behavior of other methods
   * will change based on most-recent invocation of this method!
   * @param dir - New working directory
   */
  async setWorkingDir(dir?: string) {
    this.workingRelDir = dir;
    try {
      await fs.ensureDir(this.absoluteDir);
    } catch {
      throw new Error(
        `Failed to ensure working directory '${this.absoluteDir}'`
      );
    }
    return this.absoluteDir;
  }

  get absoluteDir() {
    return join(this.topLevelAbsDir, this.relativeDir);
  }

  absolutePath(fileName: string): string {
    return join(this.absoluteDir, fileName);
  }

  get relativeDir() {
    return join(this.topLevelRelDir, this.workingRelDir);
  }

  relativePath(fileName: string): string {
    return join(this.relativeDir, fileName);
  }

  // Save `buffer` to `fileName`. The file must not already exist.
  async saveFile(fileName: string, buffer: Buffer): Promise<FileDetails> {
    const fullPath = this.absolutePath(fileName);

    return new Promise((resolve, reject) => {
      let fileSize = NaN;

      fs.open(fullPath, "w", (err, fd) => {
        if (err) {
          reject(Error(`File '${fullPath}' already exists`));
        }

        fs.write(fd, buffer, (err, bytesWritten) => {
          if (err) {
            reject(Error(`Failed to write '${fullPath}'`));
          }
          fileSize = bytesWritten;
        });

        fs.close(fd, (err) => {
          if (err) {
            reject(Error(`Failed to close '${fullPath}'`));
          }

          resolve({
            fileName,
            fullPath,
            fileSize,
          });
        });
      });
    });
  }

  // Delete a file at `fileName`.
  deleteFile(fileName: string): Promise<unknown> {
    const fullPath = this.absolutePath(fileName);

    return new Promise((resolve, reject) => {
      fs.unlink(fullPath, (err) => {
        if (err) {
          reject(err);
        }
        resolve(fullPath);
      });
    });
  }
}
