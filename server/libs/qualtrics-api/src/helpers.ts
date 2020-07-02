import { fromBuffer } from "yauzl";
import { DateTime } from "luxon";

/*
 * ---------- Time and date ----------
 */
export function nowUtc(): string {
  return DateTime.utc().toString();
}

export function isValidDate(dateIn: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateIn);
}

export function normalizeDateTime(dateIn: string): string {
  const dt = DateTime.fromISO(dateIn, { zone: "utc" });
  return dt.toString();
}

/** Sleep for `ms` milliseconds and resolve. */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
 * ---------- Zip files ----------
 */

export class ZipFileEntry {
  fileName = "";
  content = "";

  constructor(fileName: string) {
    this.fileName = fileName;
  }
}

/** Unzip PKZIP data in a node Buffer.
 * Returns a list of ZipFileEntries containing the data.
 */
export function extractZipContent(inBuffer: Buffer): Promise<ZipFileEntry[]> {
  return new Promise((resolve, reject) => {
    fromBuffer(inBuffer, (err, zipFile) => {
      if (err) {
        return reject(err);
      }
      if (!zipFile) {
        throw new Error("Bogus zipFile");
      }

      const entries: ZipFileEntry[] = [];
      zipFile.on("entry", (entry) => {
        const currentEntry = new ZipFileEntry(entry.fileName);
        entries.push(currentEntry);

        zipFile.openReadStream(entry, (err, readStream) => {
          if (err) {
            return reject(err);
          }
          if (!readStream) {
            throw new Error("Bogus readStream");
          }
          const chunks: string[] = [];
          readStream.on("data", (chunk) => {
            chunks.push(chunk.toString());
          });
          readStream.on("end", () => {
            currentEntry.content = chunks.join("");
            return resolve(entries);
          });
        });
      });
    });
  });
}
