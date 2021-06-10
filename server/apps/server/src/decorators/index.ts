import { isFunction } from "@nestjs/common/utils/shared.utils";
import { ReturnTypeFunc, Field, FieldOptions } from "@nestjs/graphql";
import { Column } from "typeorm";

interface FieldColumnOptions {
  nullable?: boolean;
  default?: string | number | boolean;
  unique?: boolean;
  type?: "integer" | "text";
}

export function FieldColumn(
  description: string,
  fieldColumnOptions?: FieldColumnOptions
): PropertyDecorator;

export function FieldColumn(
  description: string,
  returnTypeFunction?: ReturnTypeFunc,
  fieldColumnOptions?: FieldColumnOptions
): PropertyDecorator;

export function FieldColumn(
  description: string,
  typeOrOptions?: ReturnTypeFunc | FieldColumnOptions,
  fieldColumnOptions?: FieldColumnOptions
): PropertyDecorator {
  const [typeFunc, options] = isFunction(typeOrOptions)
    ? [typeOrOptions, fieldColumnOptions]
    : [undefined, typeOrOptions as FieldColumnOptions];

  return (target: any, propertyName: string) => {
    // Field
    const fieldOptions: FieldOptions = {
      description,
      nullable: options?.nullable,
      defaultValue: options?.default,
    };

    if (typeFunc) {
      Field(typeFunc as ReturnTypeFunc, fieldOptions)(target, propertyName);
    } else {
      Field(fieldOptions)(target, propertyName);
    }

    // Column
    Column({
      comment: description,
      nullable: options?.nullable,
      default: options?.default,
      unique: options?.unique,
      type: options?.type,
    })(target, propertyName);
  };
}

// Credits:
// * The structure of some function overloads is cribbed from @nestjs/graphql decorators.
