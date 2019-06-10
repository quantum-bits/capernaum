import { fromBuffer } from "yauzl";

class ZipFileEntry {
  fileName: string = "";
  content: string = "";

  constructor(fileName: string) {
    this.fileName = fileName;
  }
}

/** Unzip PKZIP data in a node Buffer.
 * Returns a list of ZipFileEntries containing the data.
 */
export async function extractZipContent(inBuffer: Buffer) {
  return new Promise((resolve, reject) => {
    fromBuffer(inBuffer, (err, zipFile) => {
      if (err) {
        return reject(err);
      }
      if (!zipFile) {
        throw new Error("Bogus zipFile");
      }

      const entries: ZipFileEntry[] = [];
      zipFile.on("entry", entry => {
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
          readStream.on("data", chunk => {
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
