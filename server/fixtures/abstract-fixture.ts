export abstract class AbstractFixture {
  abstract delete(): void;
  abstract insert(): void;

  async load() {
    await this.delete();
    await this.insert();
  }
}
