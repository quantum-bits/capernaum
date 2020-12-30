import { EntityTarget } from "typeorm/common/EntityTarget";
import _ from "lodash";
import { EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";
import pluralize from "pluralize";

export type FabricatedData = { [key: string]: string | number | boolean };

@Injectable()
export abstract class AbstractFabricatorService {
  constructor(protected readonly entityMgr: EntityManager) {}

  verifyColumns<Entity>(
    target: EntityTarget<Entity>,
    data: FabricatedData
  ): void {
    const columnNames = _.chain(
      this.entityMgr.getRepository(target).metadata.ownColumns
    )
      .reject((col) => col.isPrimary || col.isCreateDate)
      .map((col) => col.propertyName)
      .value();
    const dataNames = _.keys(data);

    const extraColumnNames = _.difference(columnNames, dataNames);
    const extraDataNames = _.difference(dataNames, columnNames);

    function makeMessage(message: string, names: string[]): string {
      const fields = pluralize("field", names.length);
      const quotedNames = names.map((name) => `'${name}'`);
      return `${message} ${fields} ${quotedNames}`;
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
  }

  dumpMetadata<Entity>(target: EntityTarget<Entity>): void {
    const metadata = this.entityMgr.getRepository(target).metadata;
    console.log("NAME", metadata.name);
    console.log("TABLE NAME", metadata.tableName);
    console.log("TABLE PATH", metadata.tablePath);
    console.log("SCHEMA PATH", metadata.schemaPath);
    for (const column of metadata.ownColumns) {
      console.log("NAME", column.propertyName);
      console.group();
      console.log("DB NAME", column.databaseName);
      console.log("PROP PATH", column.propertyPath);
      console.log("DB PATH", column.databasePath);
      console.log("TYPE", column.type);
      console.log("LENGTH", column.length);
      console.log("NULLABLE", column.isNullable);
      console.log("DEFAULT", column.default);
      console.groupEnd();
    }
  }
}
