import { getDebugger } from "@helpers/debug-factory";
import { Model } from "objection";

export type FixtureUpdate = Record<string, unknown>;
export type SimpleFixtureData = Array<Record<string, unknown>>;

const debug = getDebugger("fixture:abstract");

export abstract class AbstractFixture {
  abstract delete(): void;
  abstract insert(update?: FixtureUpdate): void;

  updateFromOptions(data: SimpleFixtureData, update: FixtureUpdate) {
    debug("update fixture with %o", update);
    return data.map((datum) => ({
      ...datum,
      ...update,
    }));
  }

  async updateFromTypeModel(
    modelClass: typeof Model,
    data: any,
    fromProp: string,
    toProp: string
  ) {
    const keyToIdMap = new Map<string, number>();
    const elementTypes = await modelClass.query();
    elementTypes.forEach((element) =>
      keyToIdMap.set(element["key"], element["id"])
    );
    debug("keyToId %O", keyToIdMap);

    const updatedData = data.map((datum) => {
      datum[toProp] = keyToIdMap.get(datum[fromProp]);
      delete datum[fromProp];
      return datum;
    });
    debug("updated data %O", updatedData);
    return updatedData;
  }

  async load(update?: FixtureUpdate) {
    await this.delete();
    await this.insert(update);
  }
}
