import { isFunction } from "@nestjs/common/utils/shared.utils";
import { ReturnTypeFunc, Field, FieldOptions } from "@nestjs/graphql";
import {
  Column,
  ColumnOptions,
  ManyToOne,
  ObjectType,
  RelationOptions,
} from "typeorm";

type FieldColumnOptions = FieldOptions & ColumnOptions;
type FieldRelationOptions = FieldOptions & RelationOptions;

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
  typeOrOptions: ReturnTypeFunc | FieldColumnOptions,
  fieldColumnOptions?: FieldColumnOptions
): PropertyDecorator {
  const [typeFunc, options = {}] = isFunction(typeOrOptions)
    ? [typeOrOptions, fieldColumnOptions]
    : [undefined, typeOrOptions as FieldColumnOptions];

  return (target: any, propertyName: string) => {
    // Field
    const fieldOptions: FieldOptions = {
      description,
      nullable: options.nullable,
      defaultValue: options.default,
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
    })(target, propertyName);
  };
}

export function FieldManyToOne<T>(
  description: string,
  typeFunction: (type?: any) => ObjectType<T>,
  inverseFunction: (object: T) => any,
  options: FieldRelationOptions = {}
): PropertyDecorator {
  return (target: any, propertyName: string) => {
    ManyToOne(typeFunction, inverseFunction)(target, propertyName);
    Field(typeFunction, options)(target, propertyName);
  };
}

// Credits:
// * The structure of the function overloads is cribbed from the @nestjs/graphql decorators.
