import { getDebugger } from "@helpers/debug-factory";
import { Model } from "objection";

export type FixtureUpdate = Record<string, unknown>;
export type SimpleFixtureData = Array<Record<string, unknown>>;

const debug = getDebugger("fixture:abstract");

export abstract class AbstractFixture {
  abstract delete(): void;
  abstract insert(update?: FixtureUpdate): void;

  /**
   * Update fixture data.
   * @param data existing data
   * @param update updated values to be "merged" using object spread.
   */
  updateFromOptions(data: SimpleFixtureData, update: FixtureUpdate) {
    debug("update fixture with %o", update);
    return data.map((datum) => ({
      ...datum,
      ...update,
    }));
  }

  /**
   * Update an FK in fixture data with the PK/ID of a "type" table (e.g., letter type).
   * NOTE: updates the fixture data passed in. Also returns the updated version as a convenience.
   * @param modelClass the "type" table; must have a PK of `id` and column called `key`.
   * @param data fixture data to update; an array of objects
   * @param fromProp name of a property in the fixture data
   * whose value is one of the `key` values from the type table
   * @param toProp name of property in the fixture data to set with the PK/ID of the
   * row in the type table whose `key` matches the value of `fromProp`
   */
  async updateFromTypeModel(
    modelClass: typeof Model,
    data: any,
    fromProp: string,
    toProp: string
  ) {
    // Map type table `key` values to corresponding PK/ID.
    const keyToIdMap = new Map<string, number>();
    const elementTypes = await modelClass.query();
    elementTypes.forEach((element) =>
      keyToIdMap.set(element["key"], element["id"])
    );
    debug("keyToId %O", keyToIdMap);

    // Update the fixture data as detailed in the function comments.
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
