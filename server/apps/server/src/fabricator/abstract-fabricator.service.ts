import { EntityTarget } from "typeorm/common/EntityTarget";
import _ from "lodash";
import { EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";
import pluralize from "pluralize";
import Debug from "debug";

const debug = Debug("test:abstract");

export type FabricatedData = { [key: string]: string | number | boolean };

@Injectable()
export abstract class AbstractFabricatorService {
  constructor(protected readonly entityMgr: EntityManager) {}

  /**
   * Ensure that the data fields in the `target` entity and the `data` object match.
   * If either one has fields not in the other, throw an error with information on
   * the mismatched fields.
   *
   * @param target Entity being fabricated (e.g., `Group` or `Survey`)
   * @param data Fabricated data for the `target` entity.
   */
  verifyFabricatedData<Entity>(
    target: EntityTarget<Entity>,
    data: FabricatedData
  ): Entity {
    const columnNames = _.chain(
      this.entityMgr.getRepository(target).metadata.ownColumns
    )
      .reject(
        (col) =>
          col.isPrimary ||
          col.isCreateDate ||
          col.referencedColumn !== undefined
      )
      .map((col) => col.propertyName)
      .value();
    const dataNames = _.keys(data);

    const extraColumnNames = _.difference(columnNames, dataNames);
    const extraDataNames = _.difference(dataNames, columnNames);
    debug("verifyFabricatedData %O", {
      target,
      data,
      columnNames,
      dataNames,
      extraColumnNames,
      extraDataNames,
    });

    function makeMessage(message: string, names: string[]): string {
      const fields = pluralize("field", names.length);
      const quotedNames = names.map((name) => `'${name}'`);
      return `${message} ${fields}: ${quotedNames}`;
    }

    const messages = [];
    if (extraColumnNames.length > 0) {
      messages.push(makeMessage("No value for", extraColumnNames));
    }
    if (extraDataNames.length > 0) {
      messages.push(makeMessage("Extra data for", extraDataNames));
    }

    if (messages.length > 0) {
      throw new ReferenceError(messages.join("\n"));
    }

    return (data as unknown) as Entity;
  }
}
